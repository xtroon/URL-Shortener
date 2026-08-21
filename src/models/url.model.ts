import { Url } from "node:url";
import { pool } from "../config/db.js";
import { encodeBase62 } from "../utils/base62.js";

export interface UrlRecord {
  id: number;
  short_url: string;
  original_url: string;
  clicks: number;
  created_at: Date;
}

//COMMANDSSS

//inserting a new URL in DB
export const createShortURL = async (originalURL: string): Promise<UrlRecord> => {

  //inserting temp placeholder to get new id
  const insertedID = await pool.query(
    `INSERT INTO urls (short_url, original_url) VALUES ($1, $2) RETURNING id;`,
    ["temp", originalURL]
  )

  const id = insertedID.rows[0].id

  //generate base62 short code from id
  const shortCode = encodeBase62(id)

  //update row with short code
  const updated = await pool.query(
    `UPDATE urls SET short_url = $1 WHERE id = $2 RETURNING *;`,
    [shortCode, id]
  )

  return updated.rows[0];
}


// find url record by its base62 code
export const getUrlByShortCode = async (shortCode: string): Promise<UrlRecord | null> => {
  const result = await pool.query(
    `SELECT * FROM urls WHERE short_url = $1;`,
    [shortCode]
  );
  return result.rows[0] || null;
};


//click count track
export const incrementClicks = async (shortCode: string): Promise<void> => {
  await pool.query(
    `UPDATE urls SET clicks = clicks + 1 WHERE short_url = $1;`,
    [shortCode]
  );
};
