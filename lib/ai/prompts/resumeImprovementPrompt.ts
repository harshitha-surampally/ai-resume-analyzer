import type { ResumeAnalysisResult } from "@/lib/ai/types";

export function buildResumeImprovementPrompt(
  resumeText: string,
  analysis: ResumeAnalysisResult
): string {
  return `
You are an expert resume optimization assistant.

Your task is to improve selected lines or bullet points from the resume while preserving the candidate's original facts.

STRICT TRUTH-PRESERVATION RULES:
- Do NOT invent skills, technologies, tools, companies, job titles, projects, education, certifications, dates, metrics, numbers, achievements, or results.
- Do NOT add information that is not supported by the original resume.
- Do NOT exaggerate responsibility. For example, do not change "worked on" to "led" unless leadership is explicitly supported by the resume.
- Every "original" value must be copied exactly from the provided resume text.
- Improve wording, clarity, action verbs, conciseness, and ATS readability only when the improvement remains factually supported.
- If a line cannot be safely improved without inventing information, do not include it.

Use the resume analysis as guidance for deciding which content would benefit most from improvement.

Respond with ONLY valid JSON.
Do not use markdown fences.
Do not include commentary before or after the JSON.

The JSON must match this exact shape:
{
  "improvements": [
    {
      "section": string,
      "original": string,
      "improved": string,
      "rationale": string
    }
  ],
  "overallNotes": string
}

Return only meaningful improvements. Do not rewrite the entire resume.

Resume analysis:
${JSON.stringify(analysis)}

Original resume text:
"""
${resumeText}
"""
`.trim();
}