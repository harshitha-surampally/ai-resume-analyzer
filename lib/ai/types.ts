export interface ResumeAnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  jobMatchScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  // Phase 7: AI Resume Improvement Assistant
atsScore?: number;
atsIssues?: string[];

sectionFeedback?: {
  section: string;
  score: number;
  feedback: string;
}[];

recommendedKeywords?: string[];
missingSections?: string[];
priorityImprovements?: string[];
achievementSuggestions?: string[];
}
// Phase 8: AI Resume Rewriter & Optimization
export interface ResumeImprovement {
  section: string;
  original: string;
  improved: string;
  rationale?: string;
}

export interface ResumeImprovementResult {
  improvements: ResumeImprovement[];
  overallNotes?: string;
}