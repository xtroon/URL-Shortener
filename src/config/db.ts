import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const connectDB = async (): Promise<void> => {
  let client;
  
  try {
    client = await pool.connect();
    console.log("Connected to Neon Postgres Database");
  } 
  catch (err: any) {
    console.error("Database connection error:", err.message || err);
    process.exit(1);
  } 
  finally {
    if (client) {
      client.release();
    }
  }
}