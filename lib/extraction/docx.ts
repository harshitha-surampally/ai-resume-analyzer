import mammoth from "mammoth";
import type { ExtractionResult } from "@/types";

export async function extractTextFromDocx(
  buffer: Buffer
): Promise<ExtractionResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();

    if (!text) {
      return {
        success: false,
        message: "No readable text was found in this DOCX file.",
      };
    }

    return {
      success: true,
      data: {
        text,
        charCount: text.length,
        fileType: "docx",
      },
    };
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return {
      success: false,
      message: "Failed to extract text from the DOCX file.",
    };
  }
}