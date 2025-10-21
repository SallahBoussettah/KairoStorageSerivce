import postgres from "postgres";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/kairoo_storage";

async function testConnection() {
  console.log("🔌 Testing database connection...");
  console.log(
    "Connection string:",
    connectionString.replace(/:[^:@]+@/, ":****@")
  );

  try {
    const sql = postgres(connectionString);
    const result = await sql`SELECT version()`;
    console.log("✅ Database connected successfully!");
    console.log("PostgreSQL version:", result[0].version);

    // Test if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("\n📋 Tables in database:");
    tables.forEach((t) => console.log("  -", t.table_name));

    await sql.end();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Database connection failed!");
    console.error("Error:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("1. Is PostgreSQL running?");
    console.error("2. Does the database 'kairoo_storage' exist?");
    console.error("3. Is the username correct?");
    console.error("4. Is the password correct in .env.local?");
    console.error("5. Is PostgreSQL listening on localhost:5432?");
    process.exit(1);
  }
}

testConnection();
