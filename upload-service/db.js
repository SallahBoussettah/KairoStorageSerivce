import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.js";

// Database configuration from environment variables
const connectionConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// Validate required environment variables
if (!process.env.DB_PASSWORD) {
  console.error("❌ ERROR: DB_PASSWORD environment variable is required!");
  console.error("Please set DB_PASSWORD in your .env file");
  console.error("\nMake sure you have a .env file with:");
  console.error("DB_PASSWORD=your_password");
  process.exit(1);
}

const pool = new Pool(connectionConfig);

export const db = drizzle(pool, { schema });
