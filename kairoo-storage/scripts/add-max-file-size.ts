import postgres from "postgres";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/kairoo_storage";

async function addMaxFileSizeColumn() {
  console.log("🔧 Adding max_file_size column to projects table...");

  try {
    const sql = postgres(connectionString);

    // Check if column exists
    const columnExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name = 'max_file_size'
    `;

    if (columnExists.length > 0) {
      console.log("✅ Column already exists!");
      await sql.end();
      process.exit(0);
    }

    // Add the column
    await sql`
      ALTER TABLE projects 
      ADD COLUMN max_file_size INTEGER NOT NULL DEFAULT 52428800
    `;

    console.log("✅ Column added successfully!");
    console.log("   Default: 50MB (52428800 bytes)");

    await sql.end();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Failed to add column!");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

addMaxFileSizeColumn();
