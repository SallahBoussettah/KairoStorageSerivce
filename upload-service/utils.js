import { mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export function getFileType(mimeType) {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

export async function ensureUploadDir(projectName, fileType) {
  const uploadsRoot = process.env.UPLOADS_ROOT || "./uploads";
  const uploadDir = path.join(uploadsRoot, projectName, `${fileType}s`);

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  return uploadDir;
}

export function generateUniqueFilename(originalName) {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${nameWithoutExt}_${timestamp}_${random}${ext}`;
}
