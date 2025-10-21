import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { unlink } from "fs/promises";

function getApiKey(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.substring(7);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = getApiKey(request);

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const { id } = await params;
    const fileId = parseInt(id);
    const file = await db.query.files.findFirst({
      where: and(eq(files.id, fileId), eq(files.projectId, project.id)),
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      file,
    });
  } catch (error: any) {
    console.error("Get file error:", error);
    return NextResponse.json({ error: "Failed to get file" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const apiKey = getApiKey(request);

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const { id } = await params;
    const fileId = parseInt(id);
    const file = await db.query.files.findFirst({
      where: and(eq(files.id, fileId), eq(files.projectId, project.id)),
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete file from disk (local dev) or via upload-service (production)
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // Local: delete directly from disk
      try {
        await unlink(file.path);
      } catch (error) {
        console.error("Failed to delete file from disk:", error);
      }
    } else {
      // Production: call upload-service to delete
      const uploadServiceUrl =
        process.env.STORAGE_BACKEND_URL || "https://uploads.kairoo.me";
      try {
        await fetch(`${uploadServiceUrl}/files/${fileId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
      } catch (error) {
        console.error("Failed to delete file from upload service:", error);
      }
    }

    // Delete from database
    await db.delete(files).where(eq(files.id, fileId));

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
