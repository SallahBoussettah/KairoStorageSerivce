import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

console.log("Testing database connection...");
console.log("Config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: "***",
});

try {
  const client = await pool.connect();
  const result = await client.query("SELECT NOW()");
  console.log("✅ Database connected successfully!");
  console.log("Current time:", result.rows[0].now);
  client.release();
  await pool.end();
} catch (error) {
  console.error("❌ Database connection failed:");
  console.error(error.message);
  process.exit(1);
}
