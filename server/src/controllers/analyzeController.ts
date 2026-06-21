import { Request, Response } from 'express';
import { genAI } from '../config/gemini';

export const analyzeResume = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: 'Both resumeText and jobDescription are required',
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
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    res.status(200).json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};