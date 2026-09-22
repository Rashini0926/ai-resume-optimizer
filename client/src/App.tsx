/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AnalyzeForm from './components/AnalyzeForm';
import AppNavigation from './components/AppNavigation';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import ResultCard from './components/ResultCard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import CoverLetters from './pages/CoverLetters';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';
import type { AnalysisResult } from './types';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const PENDING_ANALYSIS_KEY = 'pending_analysis';
const COVER_LETTER_INTENT_KEY = 'cover_letter_intent';
interface PendingAnalysis { result: AnalysisResult; jobDescription: string; }

const readPendingAnalysis = (): PendingAnalysis | null => {
  try {
    const saved = sessionStorage.getItem(PENDING_ANALYSIS_KEY);
    return saved ? JSON.parse(saved) as PendingAnalysis : null;
  } catch {
    sessionStorage.removeItem(PENDING_ANALYSIS_KEY);
    return null;
  }
};

function Dashboard() {
  const { token, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const pending = readPendingAnalysis();
  const [result, setResult] = useState<AnalysisResult | null>(pending?.result ?? null);
  const [jobDescription, setJobDescription] = useState(pending?.jobDescription ?? '');
  const [showCoverLetter, setShowCoverLetter] = useState(
    () => isAuthenticated && sessionStorage.getItem(COVER_LETTER_INTENT_KEY) === 'true',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && sessionStorage.getItem(COVER_LETTER_INTENT_KEY) === 'true' && result) {
      setShowCoverLetter(true);
      sessionStorage.removeItem(COVER_LETTER_INTENT_KEY);
    }
  }, [isAuthenticated]);

  const analyze = async (resumeText: string, targetJobDescription: string, industry: string, jobRole: string) => {
    setIsLoading(true);
    setError('');
    setShowCoverLetter(false);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeText, jobDescription: targetJobDescription, industry, jobRole }),
      });
      const data = await response.json() as AnalysisResult | { error?: string };
      if (!response.ok) throw new Error('error' in data ? data.error : 'Analysis failed');
      const nextResult = data as AnalysisResult;
      setResult(nextResult);
      setJobDescription(targetJobDescription);
      sessionStorage.setItem(PENDING_ANALYSIS_KEY, JSON.stringify({ result: nextResult, jobDescription: targetJobDescription }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const requestCoverLetter = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem(COVER_LETTER_INTENT_KEY, 'true');
      navigate('/login', { state: { from: { pathname: '/dashboard' }, message: 'Sign in to generate your cover letter.' } });
      return;
    }
    setShowCoverLetter(true);
  };

  const resetAnalysis = () => {
    setResult(null);
    setJobDescription('');
    setShowCoverLetter(false);
    sessionStorage.removeItem(PENDING_ANALYSIS_KEY);
    sessionStorage.removeItem(COVER_LETTER_INTENT_KEY);
  };

  const currentStep = showCoverLetter ? 3 : result ? 2 : 1;

  return <main className="app-shell"><div className="dashboard-container">
    <AppNavigation />
    <header className="page-heading dashboard-heading"><div>
      <p className="eyebrow">Career intelligence</p><h1>Build a stronger application</h1>
      <p className="subtitle">{currentUser ? `Welcome back, ${currentUser.name}.` : 'No account required to get started.'} Compare your resume with a role, close skill gaps, and create a tailored cover letter.</p>
    </div><div className="trust-note"><strong>Private by design</strong><span>{isAuthenticated ? 'Your signed-in analyses are saved securely.' : 'Guest analyses stay in this browser session.'}</span></div></header>
    <ol className="workflow-steps" aria-label="Application workflow">
      {['Analyze resume', 'Review insights', 'Create cover letter'].map((label, index) => <li key={label} className={currentStep > index ? 'active' : ''}><span>{index + 1}</span>{label}</li>)}
    </ol>
    {!result && <AnalyzeForm onSubmit={analyze} isLoading={isLoading} />}
    {error && <div className="error-message">{error}</div>}
    {result && <section className="results-section">
      <div className="results-heading"><h2>Your resume insights</h2><button className="text-button" onClick={resetAnalysis}>Analyze another resume</button></div>
      <ResultCard result={result} />
      {!showCoverLetter && <div className="cover-letter-cta"><div><h2>Ready for your cover letter?</h2><p>{isAuthenticated ? 'Generate a personalized letter from these results.' : 'Sign in only when you are ready to generate it.'}</p></div><button className="analyze-button" onClick={requestCoverLetter}>Generate Cover Letter</button></div>}
      {showCoverLetter && token && <CoverLetterGenerator analysis={result} jobDescription={jobDescription} token={token} />}
    </section>}
    {!isAuthenticated && !result && <aside className="guest-callout"><div><strong>Want to keep your progress?</strong><span>Create a free account to save analyses, generate cover letters, and access your history.</span></div><button type="button" className="text-button" onClick={() => navigate('/register')}>Create account →</button></aside>}
  </div></main>;
}

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/history" element={<History />} />
      <Route path="/cover-letters" element={<CoverLetters />} />
    </Route>
    <Route element={<ProtectedRoute />}><Route element={<AdminRoute />}><Route path="/analytics" element={<Analytics />} /></Route></Route>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter></AuthProvider>;
}
