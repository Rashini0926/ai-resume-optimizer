export interface AnalyzeRequestBody {
  resumeText: string;
  jobDescription: string;
  userId?: string;
  industry?: string;
  jobRole?: string;
}

export interface GeminiResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}
