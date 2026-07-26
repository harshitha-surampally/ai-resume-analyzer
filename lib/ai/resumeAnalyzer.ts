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

interface BaseAnalysisFields {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface JobMatchFields {
  jobMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

function hasBaseAnalysisShape(
  d: Record<string, unknown>
): d is Record<string, unknown> & BaseAnalysisFields {
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

function hasJobMatchShape(
  d: Record<string, unknown>
): d is Record<string, unknown> & JobMatchFields {
  return (
    typeof d.jobMatchScore === "number" &&
    d.jobMatchScore >= 0 &&
    d.jobMatchScore <= 100 &&
    isStringArray(d.matchedSkills) &&
    isStringArray(d.missingSkills)
  );
}

function parseAnalysisResult(
  data: unknown,
  requireJobMatch: boolean
): ResumeAnalysisResult {
  if (typeof data !== "object" || data === null) {
    throw new Error("AI response did not match the expected analysis shape.");
  }

  const d = data as Record<string, unknown>;

  if (!hasBaseAnalysisShape(d)) {
    throw new Error("AI response did not match the expected analysis shape.");
  }

  if (!requireJobMatch) {
    return {
      overallScore: d.overallScore,
      summary: d.summary,
      strengths: d.strengths,
      weaknesses: d.weaknesses,
      suggestions: d.suggestions,
      jobMatchScore: null,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  if (!hasJobMatchShape(d)) {
    throw new Error("AI response did not match the expected analysis shape.");
  }

  return {
    overallScore: d.overallScore,
    summary: d.summary,
    strengths: d.strengths,
    weaknesses: d.weaknesses,
    suggestions: d.suggestions,
    jobMatchScore: d.jobMatchScore,
    matchedSkills: d.matchedSkills,
    missingSkills: d.missingSkills,
  };
}

 

export async function analyzeResumeText(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysisResult> {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error("Cannot analyze empty resume text.");
  }
  const trimmedText = resumeText.trim().slice(0, MAX_RESUME_CHARS);
  const trimmedJobDescription =
  typeof jobDescription === "string" &&
  jobDescription.trim().length > 0
    ? jobDescription.trim().slice(0, MAX_RESUME_CHARS)
    : undefined;

const prompt = buildResumeAnalysisPrompt(
  trimmedText,
  trimmedJobDescription
);
  const rawResponse = await generateAIResponse(prompt);
  const cleaned = cleanJsonResponse(rawResponse);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

 return parseAnalysisResult(
  parsed,
  trimmedJobDescription !== undefined
);
}