import { Redis } from "ioredis"; // Changed to named import
import dotenv from "dotenv";

dotenv.config();

// Connect to Redis (uses REDIS_URL in production, fallback to local)
export const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redisClient.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redisClient.on("error", (err: any) => { // Added : any type
  console.error("Redis connection error:", err);
});