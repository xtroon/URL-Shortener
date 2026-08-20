import { pool } from "../config/db.js";

const createTables = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      short_url VARCHAR(30) UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      clicks INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Table 'urls' created successfully.");
  } catch (error) {
    console.error("Failed to create table:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

createTables();
