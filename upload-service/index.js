import dotenv from "dotenv";

// Load environment variables FIRST before any other imports
dotenv.config();

import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { writeFile } from "fs/promises";
import { eq } from "drizzle-orm";
import { db } from "./db.js";
import { projects, files } from "./schema.js";
import {
  getFileType,
  ensureUploadDir,
  generateUniqueFilename,
} from "./utils.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max
  },
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "kairoo-upload-service" });
});

// Serve files endpoint
app.get("/files/:projectName/:type/:filename", async (req, res) => {
  try {
    const { projectName, type, filename } = req.params;
    const uploadsRoot = process.env.UPLOADS_ROOT || "./uploads";
    const filePath = path.join(uploadsRoot, projectName, type, filename);

    // Check if file exists
    const fs = await import("fs");
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error("File serving error:", error);
    res.status(500).json({ error: "Failed to serve file" });
  }
});

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Get API key from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "API key required" });
    }

    const apiKey = authHeader.substring(7);

    // Verify API key and get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = req.file;

    // Check file size against project limit
    const maxFileSize = project.maxFileSize || 52428800; // Default 50MB
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return res.status(413).json({
        error: "File too large",
        details: `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB for this project`,
        maxSize: maxFileSize,
        fileSize: file.size,
      });
    }

    // Get file details
    const fileType = getFileType(file.mimetype);
    const uniqueFilename = generateUniqueFilename(file.originalname);

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir(project.name, fileType);
    const filePath = path.join(uploadDir, uniqueFilename);

    // Save file to disk
    await writeFile(filePath, file.buffer);

    // Generate public URL
    const baseUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
    const publicUrl = `${baseUrl}/files/${project.name}/${fileType}s/${uniqueFilename}`;

    // Save metadata to database
    const [fileRecord] = await db
      .insert(files)
      .values({
        projectId: project.id,
        filename: uniqueFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type: fileType,
        path: filePath,
        url: publicUrl,
      })
      .returning();

    res.json({
      success: true,
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        originalName: fileRecord.originalName,
        type: fileRecord.type,
        size: fileRecord.size,
        url: fileRecord.url,
        uploadedAt: fileRecord.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message,
    });
  }
});

// Delete file endpoint
app.delete("/files/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "API key required" });
    }

    const apiKey = authHeader.substring(7);
    const fileId = parseInt(req.params.id);

    // Verify API key
    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Get file record
    const fileRecord = await db.query.files.findFirst({
      where: eq(files.id, fileId),
    });

    if (!fileRecord) {
      return res.status(404).json({ error: "File not found" });
    }

    // Verify file belongs to this project
    if (fileRecord.projectId !== project.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Delete file from disk
    const fs = await import("fs/promises");
    try {
      await fs.unlink(fileRecord.path);
    } catch (err) {
      console.error("Failed to delete file from disk:", err);
    }

    // Delete from database
    await db.delete(files).where(eq(files.id, fileId));

    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Delete failed",
      details: error.message,
    });
  }
});

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    await db.query.projects.findFirst();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Please check your database configuration in .env file");
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Kairoo Upload Service running on port ${PORT}`);
  console.log(
    `📁 Uploads directory: ${process.env.UPLOADS_ROOT || "./uploads"}`
  );
  console.log(
    `🗄️  Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  );

  await testDatabaseConnection();
});
