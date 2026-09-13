import { Request, Response } from "express";
import {
  createShortURL,
  getUrlByShortCode,
  incrementClicks,
} from "../models/url.model.js";
import { redisClient } from "../config/redis.js";

// shorten api
export const shortenUrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      res.status(400).json({ error: "Missing originalUrl" });
      return;
    }

    let formattedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const record = await createShortURL(formattedUrl);

    const requestBaseUrl = `${req.protocol}://${req.get("host")}`;
    const fullBaseUrl = process.env.PUBLIC_BASE_URL || (
      requestBaseUrl.includes("localhost:5173")
        ? "http://localhost:3000"
        : requestBaseUrl
    );
    const shortenedUrl = `${fullBaseUrl}/${record.short_url}`;

    res.status(201).json({
      shortCode: record.short_url,
      originalUrl: record.original_url,
      shortUrl: shortenedUrl,
      clicks: record.clicks,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// redirect to original url
export const redirectToOriginalUrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { shortCode } = req.params;

    // try search in cache
    let cachedUrl: string | null = null;
    try {
      cachedUrl = await redisClient.get(shortCode as string);
    } catch (error) {
      console.error("Redis unavailable, using PostgreSQL:", error);
    }
    if (cachedUrl) {
      console.log(`[Cache Hit] Redis: ${shortCode} → ${cachedUrl}`);

      incrementClicks(shortCode as string).catch((err) =>
        console.error("Async click count failed:", err),
      );

      res.redirect(302, cachedUrl);
      return;
    }

    //cache missed
    console.log(`[Cache Miss] PostgreSQL: ${shortCode}`);

    const record = await getUrlByShortCode(shortCode as string);
    if (!record) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    //save in cache
    try {
      await redisClient.set(shortCode as string, record.original_url, "EX", 86400);
    } catch (error) {
      console.error("Redis unavailable, redirecting without cache:", error);
    }

    incrementClicks(shortCode as string).catch((err) =>
      console.error("Async click count failed:", err),
    );

    res.redirect(302, record.original_url);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get number of clicks
export const getUrlStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const record = await getUrlByShortCode(shortCode as string);
    if (!record) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }
    res.status(200).json({
      shortCode: record.short_url,
      originalUrl: record.original_url,
      clicks: record.clicks,
      createdAt: record.created_at,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
