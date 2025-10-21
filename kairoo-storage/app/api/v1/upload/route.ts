import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import path from "path";
import {
  getFileType,
  ensureUploadDir,
  generateUniqueFilename,
} from "@/lib/file-utils";

// Configure route to accept larger payloads
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout for large file uploads
export const dynamic = "force-dynamic";

function getApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.substring(7);
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = getApiKey(request);

    if (!apiKey) {
      const errorResponse = NextResponse.json(
        { error: "API key required" },
        { status: 401 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    // Verify API key and get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      const errorResponse = NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    // Check content-length header before parsing
    const contentLength = request.headers.get("content-length");
    const maxFileSize = project.maxFileSize || 52428800; // Default 50MB

    if (contentLength && parseInt(contentLength) > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
      const requestSizeMB = (parseInt(contentLength) / (1024 * 1024)).toFixed(
        2
      );
      const errorResponse = NextResponse.json(
        {
          error: "File too large",
          details: `Request size (${requestSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB for this project`,
          maxSize: maxFileSize,
          requestSize: parseInt(contentLength),
        },
        { status: 413 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      const errorResponse = NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    // Double-check file size after parsing (in case content-length was missing)
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const errorResponse = NextResponse.json(
        {
          error: "File too large",
          details: `File size (${fileSizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB for this project`,
          maxSize: maxFileSize,
          fileSize: file.size,
        },
        { status: 413 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    // Get file details
    const fileType = getFileType(file.type);
    const uniqueFilename = generateUniqueFilename(file.name);

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir(project.name, fileType);
    const filePath = path.join(uploadDir, uniqueFilename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    // In development, use local Next.js serve route
    // In production, use Oracle VPS (uploads.kairoo.me)
    const isDevelopment = process.env.NODE_ENV === "development";
    const baseUrl = isDevelopment
      ? "http://localhost:3000"
      : process.env.STORAGE_BACKEND_URL || "https://uploads.kairoo.me";

    const publicUrl = isDevelopment
      ? `${baseUrl}/api/v1/serve/${encodeURIComponent(
          project.name
        )}/${fileType}s/${uniqueFilename}`
      : `${baseUrl}/files/${project.name}/${fileType}s/${uniqueFilename}`;

    // Save metadata to database
    const [fileRecord] = await db
      .insert(files)
      .values({
        projectId: project.id,
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        type: fileType,
        path: filePath,
        url: publicUrl,
      })
      .returning();

    const response = NextResponse.json({
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

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    console.error("Upload error:", error);
    const errorResponse = NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}
