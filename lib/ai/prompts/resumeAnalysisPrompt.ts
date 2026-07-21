export function buildResumeAnalysisPrompt(resumeText: string): string {
  return `
You are an expert resume reviewer. Analyze the resume text below and respond with ONLY valid JSON — no markdown fences, no commentary, no preamble.

The JSON must match this exact shape:
{
  "overallScore": number (0-100),
  "summary": string (2-3 sentences),
  "strengths": string[] (3-5 items),
  "weaknesses": string[] (3-5 items),
  "suggestions": string[] (3-5 actionable items)
}

Resume text:
"""
${resumeText}
"""
`.trim();
}