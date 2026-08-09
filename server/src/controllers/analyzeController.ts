import { Request, Response } from 'express';
import { genAI } from '../config/gemini';
import { AnalyzeRequestBody, GeminiResult } from '../config/types';
import { createAnalyticsEvent } from './analyticsController';

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
      await createAnalyticsEvent({
        userId,
        eventType: 'resume_analysis',
        industry,
        jobRole,
        atsScore: result.atsScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        suggestions: result.suggestions,
      });
    } catch (analyticsError) {
      console.error('Failed to log analytics event:', analyticsError);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analyze error:', error);

    if (error instanceof Error && error.message.includes('Gemini response')) {
      return res.status(502).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
};