import path from "path";
import fs from "fs/promises";

export function getFileType(mimeType: string): "image" | "video" | "document" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

export async function ensureUploadDir(
  projectName: string,
  fileType: string
): Promise<string> {
  const uploadsRoot = process.env.UPLOADS_ROOT || "../KairooStorageFiles";
  const uploadPath = path.join(uploadsRoot, projectName, `${fileType}s`);

  await fs.mkdir(uploadPath, { recursive: true });
  return uploadPath;
}

export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${name}_${timestamp}_${random}${ext}`;
}
