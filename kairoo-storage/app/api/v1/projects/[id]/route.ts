import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { unlink, rm } from "fs/promises";
import path from "path";

function getAuthToken(request: NextRequest): string | null {
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
      "Access-Control-Allow-Methods": "PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Update project (e.g., max file size)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthToken(request);
    if (!token || !verifyToken(token)) {
      const errorResponse = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    const { id } = await params;
    const projectId = parseInt(id);
    const { maxFileSize } = await request.json();

    if (!maxFileSize || maxFileSize < 1048576 || maxFileSize > 104857600) {
      const errorResponse = NextResponse.json(
        {
          error: "Invalid max file size",
          details: "Must be between 1MB and 100MB",
        },
        { status: 400 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    const [updatedProject] = await db
      .update(projects)
      .set({ maxFileSize, updatedAt: new Date() })
      .where(eq(projects.id, projectId))
      .returning();

    if (!updatedProject) {
      const errorResponse = NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    const response = NextResponse.json({
      success: true,
      project: updatedProject,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    console.error("Update project error:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}

// Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthToken(request);
    if (!token || !verifyToken(token)) {
      const errorResponse = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    const { id } = await params;
    const projectId = parseInt(id);

    // Get project details
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      const errorResponse = NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
      errorResponse.headers.set("Access-Control-Allow-Origin", "*");
      return errorResponse;
    }

    // Get all files for this project
    const projectFiles = await db.query.files.findMany({
      where: eq(files.projectId, projectId),
    });

    // Delete all files from disk
    for (const file of projectFiles) {
      try {
        await unlink(file.path);
      } catch (error) {
        console.error(`Failed to delete file: ${file.path}`, error);
      }
    }

    // Delete project folder
    const uploadsRoot = process.env.UPLOADS_ROOT || "../KairooStorageFiles";
    const projectFolder = path.join(uploadsRoot, project.name);
    try {
      await rm(projectFolder, { recursive: true, force: true });
    } catch (error) {
      console.error(`Failed to delete project folder: ${projectFolder}`, error);
    }

    // Delete from database (cascade will delete files records)
    await db.delete(projects).where(eq(projects.id, projectId));

    const response = NextResponse.json({
      success: true,
      message: "Project and all associated files deleted successfully",
      deletedFiles: projectFiles.length,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    console.error("Delete project error:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}
