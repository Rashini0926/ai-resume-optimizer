import { useEffect, useState } from 'react';
import AppNavigation from '../components/AppNavigation';
import HistoryTable, { type HistoryItem } from '../components/HistoryTable';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function History() {
  const { token } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json() as HistoryItem[] | { error?: string };
        if (!response.ok) throw new Error(!Array.isArray(data) ? data.error : 'Unable to load history');
        setItems(data as HistoryItem[]);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load history'))
      .finally(() => setIsLoading(false));
  }, [token]);

  return <main className="app-shell">
    <div className="dashboard-container">
      <AppNavigation />
      <header className="page-heading">
        <div><p className="eyebrow">Application workspace</p><h1>Analysis history</h1><p className="subtitle">Review every saved resume analysis and monitor your ATS progress.</p></div>
      </header>
      {isLoading && <div className="page-state"><span className="spinner dark" /> Loading your history…</div>}
      {error && <div className="error-message" role="alert">{error}</div>}
      {!isLoading && !error && <HistoryTable items={items} />}
    </div>
  </main>;
}
