import express from "express";
import rateLimit from "express-rate-limit";
import urlRouter from "./routes/url.routes.js";

const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "").split(",").filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!ALLOWED_ORIGINS.length || (origin && ALLOWED_ORIGINS.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: "100kb" }));

// Rate limiters
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many URLs shortened. Try again in a minute." },
});

const statsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again in a minute." },
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Slow down." },
});

app.use(globalLimiter);
app.use("/api/shorten", shortenLimiter);
app.use("/api/stats", statsLimiter);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} → handled by ${process.env.HOSTNAME || "unknown"}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/", urlRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
