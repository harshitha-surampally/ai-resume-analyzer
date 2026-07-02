import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import {
  MAX_FILE_SIZE_BYTES,
  isAllowedFileSize,
  isAllowedFileType,
} from "@/lib/upload";
import { UploadResponse } from "@/types";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(
  request: Request
): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file was provided." },
        { status: 400 }
      );
    }

    if (!isAllowedFileType(file)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF and DOCX files are supported.",
        },
        { status: 400 }
      );
    }

    if (!isAllowedFileSize(file.size)) {
      return NextResponse.json(
        {
          success: false,
          message: `File is too large. Maximum size is ${
            MAX_FILE_SIZE_BYTES / (1024 * 1024)
          }MB.`,
        },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const uniqueFilename = `${randomUUID()}-${sanitizeFileName(file.name)}`;
    const destination = path.join(UPLOAD_DIR, uniqueFilename);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(destination, Buffer.from(arrayBuffer));

    return NextResponse.json({
      success: true,
      filename: uniqueFilename,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while uploading the file.",
      },
      { status: 500 }
    );
  }
}
