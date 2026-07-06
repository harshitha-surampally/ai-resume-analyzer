import { PDFParse } from "pdf-parse";
import type { ExtractionResult } from "@/types";

export async function extractTextFromPdf(
  buffer: Buffer
): Promise<ExtractionResult> {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = result.text.trim();

    if (!text) {
      return {
        success: false,
        message:
          "No readable text was found in this PDF. It may be a scanned image rather than real text.",
      };
    }

    return {
      success: true,
      data: {
        text,
        charCount: text.length,
        fileType: "pdf",
      },
    };
  } catch (error) {
    console.error("PDF extraction error:", error);
    return {
      success: false,
      message: "Failed to extract text from the PDF file.",
    };
  } finally {
    await parser.destroy();
  }
}