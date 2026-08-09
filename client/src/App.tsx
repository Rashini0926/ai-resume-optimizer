import { useState } from 'react';
import AnalyzeForm from './components/AnalyzeForm';
import ResultCard from './components/ResultCard';
import type { AnalysisResult } from './types';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (resumeText: string, jobDescription: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          userId: 'user-1',
          industry: 'Software Development',
          jobRole: 'Software Engineer',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Analysis failed. Please try again.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1>AI Resume Optimizer</h1>
      <AnalyzeForm onSubmit={handleAnalyze} isLoading={isLoading} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <ResultCard result={result} />}
    </main>
  );
}

export default App;