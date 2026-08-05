import { NextResponse } from "next/server";
import { extractResumeText } from "@/lib/extraction";
import {
  MAX_FILE_SIZE_BYTES,
  isAllowedFileSize,
  isAllowedFileType,
} from "@/lib/upload";
import { UploadResponse } from "@/types";

export const runtime = "nodejs";




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

  

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

  

    const extraction = await extractResumeText(buffer, file.name);

    return NextResponse.json({
      success: true,
      filename: file.name,
      message: "File uploaded successfully",
      extraction,
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
