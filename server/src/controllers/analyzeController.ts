import { Request, Response } from 'express';
import { genAI } from '../config/gemini';
import { AnalyzeRequestBody, GeminiResult } from '../config/types';
import ResumeAnalysis from '../models/ResumeAnalysis';

const parseGeminiResponse = (text: string): GeminiResult => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Gemini response did not contain a valid JSON object');
  }
  const parsed = JSON.parse(jsonMatch[0]) as GeminiResult;

  if (
    typeof parsed.atsScore !== 'number' ||
    !Array.isArray(parsed.matchedKeywords) ||
    !Array.isArray(parsed.missingKeywords) ||
    !Array.isArray(parsed.suggestions)
  ) {
    throw new Error('Gemini response did not contain expected result shape');
  }

  return parsed;
};

export const analyzeResume = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const {
      resumeText,
      jobDescription,
      userId = 'anonymous',
      industry = 'General',
      jobRole = 'General',
    } = req.body as AnalyzeRequestBody;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: 'resumeText and jobDescription are required',
      });
    }

    const prompt = `You are an ATS (Applicant Tracking System) and resume expert.
Compare the resume below against the job description and respond with ONLY
valid JSON (no markdown, no extra text) in this exact format:

{
  "atsScore": <number 0-100>,
  "matchedKeywords": [<strings>],
  "missingKeywords": [<strings>],
  "suggestions": [<3-5 specific improvement strings>]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text ?? '';
    const result = parseGeminiResponse(rawText);

    try {
      const savedAnalysis = await ResumeAnalysis.create({
        userId,
        industry,
        jobRole,
        atsScore: result.atsScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        suggestions: result.suggestions,
      });
      console.info(`Resume analysis saved: ${savedAnalysis.id}`);
    } catch (saveError) {
      // A successful analysis must not be presented as saved when persistence fails.
      console.error('Failed to save resume analysis:', saveError);
      return res.status(500).json({ error: 'Analysis completed, but it could not be saved to history' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analyze error:', error);

    if (error instanceof Error && error.message.includes('Gemini response')) {
      return res.status(502).json({ error: error.message });
    }

    const message = error instanceof Error ? error.message : 'Unknown analysis error';
    return res.status(500).json({
      error: process.env.NODE_ENV === 'development'
        ? `Failed to analyze resume: ${message}`
        : 'Failed to analyze resume',
    });
  }
};
