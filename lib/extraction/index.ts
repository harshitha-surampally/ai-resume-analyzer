import { extractTextFromDocx } from "@/lib/extraction/docx";
import { extractTextFromPdf } from "@/lib/extraction/pdf";
import type { ExtractionResult, SupportedResumeFileType } from "@/types";

function getFileType(filename: string): SupportedResumeFileType | null {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();

  if (extension === ".pdf") return "pdf";
  if (extension === ".docx") return "docx";
  return null;
}

export async function extractResumeText(
  buffer: Buffer,
  filename: string
): Promise<ExtractionResult> {
  const fileType = getFileType(filename);

  if (fileType === "pdf") {
    return extractTextFromPdf(buffer);
  }

  if (fileType === "docx") {
    return extractTextFromDocx(buffer);
  }

  return {
    success: false,
    message: "Unsupported file type. Only PDF and DOCX are supported.",
  };
}