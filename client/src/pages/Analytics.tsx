import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface SummaryItem {
  eventType: string;
  count: number;
  averageAtsScore: number | null;
}

interface TrendItem {
  month: string;
  count: number;
  averageAtsScore: number;
}

const formatMonth = (value: string) => {
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) return value;
  return new Date(year, month - 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

export default function Analytics() {
  const { token, currentUser } = useAuth();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_URL}/api/analytics/summary`, { headers }),
      fetch(`${API_URL}/api/analytics/trends`, { headers }),
    ]).then(async ([summaryResponse, trendsResponse]) => {
      const summaryData = await summaryResponse.json() as { data?: SummaryItem[]; error?: string };
      const trendsData = await trendsResponse.json() as { data?: TrendItem[]; error?: string };
      if (!summaryResponse.ok) throw new Error(summaryData.error || 'Unable to load analytics summary');
      if (!trendsResponse.ok) throw new Error(trendsData.error || 'Unable to load analytics trends');
      setSummary(summaryData.data ?? []);
      setTrends(trendsData.data ?? []);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Unable to load analytics'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const totals = useMemo(() => {
    const analyses = summary.find((item) => item.eventType === 'resume_analysis');
    const bestScore = trends.length ? Math.max(...trends.map((item) => item.averageAtsScore)) : null;
    return { count: analyses?.count ?? 0, average: analyses?.averageAtsScore ?? null, bestScore };
  }, [summary, trends]);

  return <main className="app-shell"><div className="dashboard-container">
    <header className="app-header"><div>
      <p className="eyebrow">Personal analytics</p>
      <h1>Your progress</h1>
      <p className="subtitle">Track how {currentUser?.name ?? 'your'} resume alignment changes over time.</p>
    </div><Link className="back-link" to="/dashboard">← Back to optimizer</Link></header>

    {isLoading && <div className="analytics-state">Loading your analytics…</div>}
    {error && <div className="error-message">{error}</div>}
    {!isLoading && !error && <>
      <section className="metric-grid">
        <article className="metric-card"><span>Total analyses</span><strong>{totals.count}</strong><small>Completed while signed in</small></article>
        <article className="metric-card"><span>Average ATS score</span><strong>{totals.average === null ? '—' : Math.round(totals.average)}</strong><small>{totals.average === null ? 'No score data yet' : 'Out of 100'}</small></article>
        <article className="metric-card"><span>Best monthly average</span><strong>{totals.bestScore === null ? '—' : Math.round(totals.bestScore)}</strong><small>{totals.bestScore === null ? 'Complete an analysis to begin' : 'Out of 100'}</small></article>
      </section>

      <section className="trend-card">
        <div><p className="eyebrow">Score history</p><h2>Monthly ATS trend</h2></div>
        {trends.length ? <div className="trend-chart" role="img" aria-label="Monthly average ATS score chart">
          {trends.map((item) => <div className="trend-column" key={item.month}>
            <span className="trend-value">{Math.round(item.averageAtsScore)}</span>
            <div className="trend-track"><div className="trend-bar" style={{ height: `${Math.max(2, Math.min(100, item.averageAtsScore))}%` }} /></div>
            <small>{formatMonth(item.month)}</small>
            <em>{item.count} {item.count === 1 ? 'analysis' : 'analyses'}</em>
          </div>)}
        </div> : <div className="analytics-empty"><p>No analytics yet</p><small>Complete a resume analysis while signed in and your progress will appear here.</small></div>}
      </section>
    </>}
  </div></main>;
}
