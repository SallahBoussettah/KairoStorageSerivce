import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { admins } from "../lib/db/schema";
import { hashPassword } from "../lib/auth";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:password@localhost:5432/kairoo_storage";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || "boussettah.dev@gmail.com";
  const adminPassword = "admin123"; // Change this after first login!

  console.log("🌱 Seeding database...");

  // Check if admin already exists
  const existingAdmin = await db.query.admins.findFirst({
    where: eq(admins.email, adminEmail),
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists:", adminEmail);
    return;
  }

  // Create admin
  const passwordHash = await hashPassword(adminPassword);
  const [admin] = await db
    .insert(admins)
    .values({
      email: adminEmail,
      passwordHash,
    })
    .returning();

  console.log("✅ Admin created successfully!");
  console.log("📧 Email:", admin.email);
  console.log("🔑 Password:", adminPassword);
  console.log("⚠️  Please change the password after first login!");

  await client.end();
  process.exit(0);
}

seed().catch(async (error) => {
  console.error("❌ Seed failed:", error);
  await client.end();
  process.exit(1);
});
