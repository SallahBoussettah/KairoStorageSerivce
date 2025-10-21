import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files, projects } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = getApiKey(request);

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    // Verify API key and get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.apiKey, apiKey),
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'image', 'video', 'document'

    // Build query
    let query = db.query.files.findMany({
      where: type
        ? and(eq(files.projectId, project.id), eq(files.type, type))
        : eq(files.projectId, project.id),
      orderBy: [desc(files.uploadedAt)],
    });

    const filesList = await query;

    const response = NextResponse.json({
      success: true,
      count: filesList.length,
      files: filesList,
    });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error: any) {
    console.error("List files error:", error);
    const errorResponse = NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    return errorResponse;
  }
}
