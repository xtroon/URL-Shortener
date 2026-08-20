import express from "express";
import { pool } from './config/db.js';

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("URL Shortener");
});

export default app;