export interface ResumeAnalysisResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  jobMatchScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
}