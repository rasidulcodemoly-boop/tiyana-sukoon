import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const cleanName = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", cleanName);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

    // Determine mime type
    let contentType = "image/jpeg";
    if (cleanName.endsWith(".png")) contentType = "image/png";
    else if (cleanName.endsWith(".webp")) contentType = "image/webp";
    else if (cleanName.endsWith(".gif")) contentType = "image/gif";
    else if (cleanName.endsWith(".svg")) contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
