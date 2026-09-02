import express from "express";
import urlRouter from "./routes/url.routes.js";

const app = express();

app.use(express.json({ limit: "1kb" }));

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
