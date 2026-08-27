/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AnalyzeForm from './components/AnalyzeForm';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import HistoryTable, { type HistoryItem } from './components/HistoryTable';
import ResultCard from './components/ResultCard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
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
  const { token, currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const pending = readPendingAnalysis();
  const [result, setResult] = useState<AnalysisResult | null>(pending?.result ?? null);
  const [jobDescription, setJobDescription] = useState(pending?.jobDescription ?? '');
  const [showCoverLetter, setShowCoverLetter] = useState(
    () => isAuthenticated && sessionStorage.getItem(COVER_LETTER_INTENT_KEY) === 'true',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = async () => {
    if (!token) return;
    const response = await fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json() as HistoryItem[] | { error?: string };
    if (!response.ok) throw new Error(!Array.isArray(data) ? data.error : 'Unable to load history');
    setHistory(data as HistoryItem[]);
  };

  useEffect(() => {
    if (token) void loadHistory().catch((err) => setError(err instanceof Error ? err.message : 'Unable to load history'));
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && sessionStorage.getItem(COVER_LETTER_INTENT_KEY) === 'true' && result) {
      setShowCoverLetter(true);
      sessionStorage.removeItem(COVER_LETTER_INTENT_KEY);
    }
  }, [isAuthenticated]);

  const analyze = async (resumeText: string, targetJobDescription: string) => {
    setIsLoading(true);
    setError('');
    setShowCoverLetter(false);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeText, jobDescription: targetJobDescription, industry: 'Software Development', jobRole: 'Software Engineer' }),
      });
      const data = await response.json() as AnalysisResult | { error?: string };
      if (!response.ok) throw new Error('error' in data ? data.error : 'Analysis failed');
      const nextResult = data as AnalysisResult;
      setResult(nextResult);
      setJobDescription(targetJobDescription);
      sessionStorage.setItem(PENDING_ANALYSIS_KEY, JSON.stringify({ result: nextResult, jobDescription: targetJobDescription }));
      if (token) await loadHistory();
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

  return <main className="app-shell"><div className="dashboard-container">
    <header className="app-header"><div>
      <p className="eyebrow">Career intelligence</p><h1>AI Resume Optimizer</h1>
      <p className="subtitle">{currentUser ? `Welcome, ${currentUser.name}.` : 'Analyze your resume without creating an account.'} Improve your application with AI insights.</p>
    </div><div className="header-actions">
      {isAuthenticated ? <><button className="text-button" onClick={() => navigate('/analytics')}>My Analytics</button><button className="dashboard-button" onClick={() => window.open('https://app.powerbi.com/groups/me/reports/feafa6e8-6775-4ace-995b-658c6d55b6cb/1626fb51c9a4e8bdc383?experience=power-bi', '_blank', 'noopener,noreferrer')}>Power BI Dashboard</button><button className="text-button" onClick={() => { logout(); navigate('/dashboard'); }}>Log out</button></> : <button className="text-button" onClick={() => navigate('/login')}>Sign in</button>}
    </div></header>
    {!result && <AnalyzeForm onSubmit={analyze} isLoading={isLoading} />}
    {error && <div className="error-message">{error}</div>}
    {result && <section className="results-section">
      <div className="results-heading"><h2>Your resume insights</h2><button className="text-button" onClick={resetAnalysis}>Analyze another resume</button></div>
      <ResultCard result={result} />
      {!showCoverLetter && <div className="cover-letter-cta"><div><h2>Ready for your cover letter?</h2><p>{isAuthenticated ? 'Generate a personalized letter from these results.' : 'Sign in only when you are ready to generate it.'}</p></div><button className="analyze-button" onClick={requestCoverLetter}>Generate Cover Letter</button></div>}
      {showCoverLetter && token && <CoverLetterGenerator analysis={result} jobDescription={jobDescription} token={token} />}
    </section>}
    {isAuthenticated && <HistoryTable items={history} />}
  </div></main>;
}

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/history" element={<Dashboard />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/analytics" element={<Analytics />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter></AuthProvider>;
}
