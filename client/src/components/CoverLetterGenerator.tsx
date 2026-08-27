import { useState } from 'react';
import type { AnalysisResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const tones = ['Professional', 'Enthusiastic', 'Formal', 'Friendly'] as const;

interface Props {
  analysis: AnalysisResult;
  jobDescription: string;
  token: string;
}

export default function CoverLetterGenerator({ analysis, jobDescription, token }: Props) {
  const [tone, setTone] = useState<(typeof tones)[number]>('Professional');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/cover-letter/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ analysis, jobDescription, tone }),
      });
      const data = await response.json() as { content?: string; error?: string };
      if (!response.ok || !data.content) throw new Error(data.error || 'Unable to generate cover letter');
      setContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return <section className="cover-letter-card">
    <div>
      <p className="eyebrow">Application assistant</p>
      <h2>Generate your cover letter</h2>
      <p className="cover-letter-help">Choose a tone and create a letter using your completed resume analysis.</p>
    </div>
    <label>Writing tone
      <select value={tone} onChange={(event) => setTone(event.target.value as (typeof tones)[number])} disabled={isLoading}>
        {tones.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
    <button className="analyze-button" type="button" onClick={() => void generate()} disabled={isLoading}>
      {isLoading ? 'Generating cover letter…' : content ? 'Regenerate cover letter' : 'Generate cover letter'}
    </button>
    {error && <div className="error-message">{error}</div>}
    {content && <div className="cover-letter-result">
      <textarea aria-label="Generated cover letter" value={content} onChange={(event) => setContent(event.target.value)} rows={18} />
      <button className="text-button" type="button" onClick={() => void copy()}>Copy to clipboard</button>
    </div>}
  </section>;
}
