export function buildResumeAnalysisPrompt(
  resumeText: string,
  jobDescription?: string
): string {
  const jobDescriptionSection = jobDescription
  ? `
Job description for context:
"""
${jobDescription}
"""
`
  : "";

const jobMatchFieldsSpec = jobDescription
  ? `,
  "jobMatchScore": number (0-100, how well the resume matches the job description),
  "matchedSkills": string[] (skills/requirements from the job description that the resume demonstrates),
  "missingSkills": string[] (skills/requirements from the job description that the resume does not demonstrate)`
  : "";

return `
You are an expert resume reviewer. Analyze the resume text below and respond with ONLY valid JSON — no markdown fences, no commentary, no preamble.

The JSON must match this exact shape:
{
  "overallScore": number (0-100),
  "summary": string (2-3 sentences),
  "strengths": string[] (3-5 items),
  "weaknesses": string[] (3-5 items),
  "suggestions": string[] (3-5 actionable items)${jobMatchFieldsSpec}
}

${jobDescriptionSection}

Resume text:
"""
${resumeText}
"""
`.trim();
}