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
const phase7FieldsSpec = `,
  "atsScore": number (0-100, how well the resume would parse through an ATS system),
  "atsIssues": string[] (specific formatting/content issues that could hurt ATS parsing),
  "sectionFeedback": {
    "section": string,
    "score": number (0-10),
    "feedback": string
  }[] (feedback and score for each resume section such as Experience, Education, Skills, Projects),
  "recommendedKeywords": string[] (industry/role-relevant keywords the resume should include),
  "missingSections": string[] (standard resume sections that are absent, e.g. "Summary", "Certifications"),
  "priorityImprovements": string[] (3-5 highest-impact changes, ordered by priority),
  "achievementSuggestions": string[] (suggestions for rewriting bullet points as quantifiable achievements)`;
return `
You are an expert resume reviewer. Analyze the resume text below and respond with ONLY valid JSON — no markdown fences, no commentary, no preamble.

The JSON must match this exact shape:
{
  "overallScore": number (0-100),
  "summary": string (2-3 sentences),
  "strengths": string[] (3-5 items),
  "weaknesses": string[] (3-5 items),
  "suggestions": string[] (3-5 actionable items)${phase7FieldsSpec}${jobMatchFieldsSpec}
}

${jobDescriptionSection}

Resume text:
"""
${resumeText}
"""
`.trim();
}