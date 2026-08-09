const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompt = `You are an ATS (Applicant Tracking System) and resume expert.
Compare the resume below against the job description and respond with ONLY
valid JSON (no markdown, no extra text) in this exact format:

{
  "atsScore": 85,
  "matchedKeywords": ["React"],
  "missingKeywords": ["Java"],
  "suggestions": ["Add Java experience"]
}

RESUME: Developed a full-stack e-commerce platform using React.js and Laravel.
JOB: Software Engineer with Java, React.js, and Postgresql.`;

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    console.log('RESPONSE TEXT:');
    console.log(response.text);
  } catch (err) {
    console.error('API ERROR:', err);
  }
}

test();
