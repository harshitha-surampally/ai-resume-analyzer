import { generateAIResponse } from "./client";
import { buildResumeImprovementPrompt } from "./prompts/resumeImprovementPrompt";
import type {
  ResumeAnalysisResult,
  ResumeImprovement,
  ResumeImprovementResult,
} from "./types";
const MAX_RESUME_CHARS = 15000;

function cleanJsonResponse(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}
function isResumeImprovement(value: unknown): value is ResumeImprovement {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.section === "string" &&
    typeof item.original === "string" &&
    typeof item.improved === "string" &&
    (item.rationale === undefined || typeof item.rationale === "string")
  );
}
function parseImprovementResult(data: unknown): ResumeImprovementResult {
  if (typeof data !== "object" || data === null) {
    throw new Error("AI response did not match the expected improvement shape.");
  }

  const d = data as Record<string, unknown>;

  if (
    !Array.isArray(d.improvements) ||
    !d.improvements.every(isResumeImprovement)
  ) {
    throw new Error("AI response did not match the expected improvement shape.");
  }

  const overallNotes =
    typeof d.overallNotes === "string" ? d.overallNotes : undefined;

  return {
    improvements: d.improvements,
    overallNotes,
  };
}
function isOriginalTextPresent(
  original: string,
  resumeText: string
): boolean {
  const normalizedOriginal = original.trim().toLowerCase();
  const normalizedResume = resumeText.toLowerCase();

  return (
    normalizedOriginal.length > 0 &&
    normalizedResume.includes(normalizedOriginal)
  );
}
function extractNumberTokens(text: string): string[] {
  return text.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [];
}

function introducesNewNumbers(
  original: string,
  improved: string
): boolean {
  const originalNumbers = new Set(extractNumberTokens(original));
  const improvedNumbers = extractNumberTokens(improved);

  return improvedNumbers.some(
    (number) => !originalNumbers.has(number)
  );
}
function validateImprovements(
  result: ResumeImprovementResult,
  resumeText: string
): ResumeImprovementResult {
  const improvements = result.improvements.filter((item) => {
    if (!isOriginalTextPresent(item.original, resumeText)) {
      return false;
    }

    if (introducesNewNumbers(item.original, item.improved)) {
      return false;
    }

    return true;
  });

  return {
    improvements,
    overallNotes: result.overallNotes,
  };
}
export async function improveResumeText(
  resumeText: string,
  analysis: ResumeAnalysisResult
): Promise<ResumeImprovementResult> {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error("Cannot improve empty resume text.");
  }

  const trimmedText = resumeText.trim().slice(0, MAX_RESUME_CHARS);

  const prompt = buildResumeImprovementPrompt(trimmedText, analysis);
  const rawResponse = await generateAIResponse(prompt);
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

  const result = parseImprovementResult(parsed);

  return validateImprovements(result, trimmedText);
}