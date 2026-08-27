import { Response } from 'express';
import mongoose from 'mongoose';
import { genAI } from '../config/gemini';
import CoverLetter, { CoverLetterTone } from '../models/CoverLetter';
import ResumeAnalysis from '../models/ResumeAnalysis';
import { AuthRequest } from '../middleware/auth';

const tones: CoverLetterTone[] = ['Professional', 'Enthusiastic', 'Formal', 'Friendly'];
interface AnalysisContext { atsScore: number; matchedKeywords: string[]; suggestions: string[]; }

const validateResume = async (resumeId: string, userId: string) => {
  if (!mongoose.isValidObjectId(resumeId)) return null;
  return ResumeAnalysis.findOne({ _id: resumeId, userId });
};

const isAnalysisContext = (value: unknown): value is AnalysisContext => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AnalysisContext>;
  return typeof item.atsScore === 'number' && item.atsScore >= 0 && item.atsScore <= 100
    && Array.isArray(item.matchedKeywords) && item.matchedKeywords.every((entry) => typeof entry === 'string')
    && Array.isArray(item.suggestions) && item.suggestions.every((entry) => typeof entry === 'string');
};

export const generateCoverLetter = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeId, analysis, jobDescription, tone } = req.body as {
      resumeId?: string; analysis?: unknown; jobDescription?: string; tone?: CoverLetterTone;
    };
    if (!jobDescription?.trim() || !tone || !tones.includes(tone)) {
      return res.status(400).json({ error: 'A job description and valid tone are required' });
    }

    let context: AnalysisContext | null = null;
    if (resumeId) {
      const resume = await validateResume(resumeId, req.user!.id);
      if (!resume) return res.status(404).json({ error: 'Resume analysis not found' });
      context = { atsScore: resume.atsScore, matchedKeywords: resume.matchedKeywords, suggestions: resume.suggestions };
    } else if (isAnalysisContext(analysis)) {
      context = analysis;
    }
    if (!context) return res.status(400).json({ error: 'A valid resume analysis is required' });

    const prompt = `Write a personalized ${tone.toLowerCase()} cover letter for a candidate applying for the job below. Use the candidate's relevant strengths inferred from their ATS analysis. Use company-focused language, a strong opening, two concise body paragraphs, and a professional closing. Do not invent employers, achievements, names, addresses, or contact details. Return clean plain text only, no markdown headings.\n\nCANDIDATE ATS ANALYSIS:\nScore: ${context.atsScore}\nMatched skills: ${context.matchedKeywords.join(', ') || 'Not supplied'}\nRelevant improvement context: ${context.suggestions.join(' ')}\n\nJOB DESCRIPTION:\n${jobDescription.trim()}`;
    const response = await genAI.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    const content = response.text?.trim();
    if (!content) return res.status(502).json({ error: 'Gemini did not return a cover letter' });
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Cover-letter generation failed:', error);
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }
};

export const saveCoverLetter = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeId, jobDescription, tone, content } = req.body as { resumeId?: string; jobDescription?: string; tone?: CoverLetterTone; content?: string };
    if (!resumeId || !jobDescription?.trim() || !content?.trim() || !tone || !tones.includes(tone)) return res.status(400).json({ error: 'Resume, job description, tone, and content are required' });
    const resume = await validateResume(resumeId, req.user!.id);
    if (!resume) return res.status(404).json({ error: 'Resume analysis not found' });
    const letter = await CoverLetter.create({ userId: req.user!.id, resumeId, jobDescription: jobDescription.trim(), tone, content: content.trim() });
    return res.status(201).json(letter);
  } catch (error) {
    console.error('Cover-letter save failed:', error);
    return res.status(500).json({ error: 'Failed to save cover letter' });
  }
};

export const getCoverLetters = async (req: AuthRequest, res: Response) => {
  try {
    const letters = await CoverLetter.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50).lean();
    return res.status(200).json(letters);
  } catch (error) {
    console.error('Cover-letter fetch failed:', error);
    return res.status(500).json({ error: 'Failed to fetch cover letters' });
  }
};

export const getCoverLetterById = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid cover letter ID' });
  const letter = await CoverLetter.findOne({ _id: req.params.id, userId: req.user!.id }).lean();
  return letter ? res.status(200).json(letter) : res.status(404).json({ error: 'Cover letter not found' });
};

export const deleteCoverLetter = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid cover letter ID' });
  const letter = await CoverLetter.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  return letter ? res.status(204).send() : res.status(404).json({ error: 'Cover letter not found' });
};
