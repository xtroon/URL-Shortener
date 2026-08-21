import { Request, Response } from "express";
import { createShortURL, getUrlByShortCode, incrementClicks } from "../models/url.model.js";


// shorten api
export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            res.status(400).json({ error: "Missing original_url" });
            return;
        }

        const record = await createShortURL(originalUrl);

        const fullBaseUrl = `${req.protocol}://${req.get("host")}`;
        const shortenedUrl = `${fullBaseUrl}/${record.short_url}`;

        res.status(201).json({
            shortCode: record.short_url, originalUrl: record.original_url,
            shortUrl: shortenedUrl,
        });
    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// redirect to original url
export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shortCode } = req.params;
        const record = await getUrlByShortCode(shortCode as string);
        if (!record) {
            res.status(404).json({ error: "Short URL not found" });
            return;
        }

        await incrementClicks(shortCode as string);

        res.redirect(302, record.original_url);
    } catch (error) {
        console.error("Error redirecting:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//get number of clicks
export const getUrlStats = async (req: Request, res: Response): Promise<void> => {
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