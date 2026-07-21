import { generateAIResponse } from "./client";
import { buildResumeAnalysisPrompt } from "./prompts/resumeAnalysisPrompt";
import type { ResumeAnalysisResult } from "./types";
const MAX_RESUME_CHARS = 15000;

function cleanJsonResponse(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

function isValidAnalysisResult(data: unknown): data is ResumeAnalysisResult {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const d = data as Record<string, unknown>;

  return (
    typeof d.overallScore === "number" &&
    d.overallScore >= 0 &&
    d.overallScore <= 100 &&
    typeof d.summary === "string" &&
    isStringArray(d.strengths) &&
    isStringArray(d.weaknesses) &&
    isStringArray(d.suggestions)
  );
}

export async function analyzeResumeText(
  resumeText: string
): Promise<ResumeAnalysisResult> {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error("Cannot analyze empty resume text.");
  }
  const trimmedText = resumeText.trim().slice(0, MAX_RESUME_CHARS);
  const prompt = buildResumeAnalysisPrompt(trimmedText);
  const rawResponse = await generateAIResponse(prompt);
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

  if (!isValidAnalysisResult(parsed)) {
    throw new Error(
      "AI response did not match the expected analysis shape."
    );
  }

  return parsed;
}