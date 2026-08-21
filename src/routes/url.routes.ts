import { Router } from "express";
import { shortenUrl, redirectToOriginalUrl, getUrlStats } from "../controller/url.controller.js";

const router = Router();

// shorten api
router.post("/api/shorten", shortenUrl);
//stats api
router.get("/api/stats/:shortCode", getUrlStats);

//redirect api
router.get("/:shortCode", redirectToOriginalUrl);

export default router;
