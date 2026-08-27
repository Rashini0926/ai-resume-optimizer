import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const tones = ['Professional', 'Enthusiastic', 'Formal', 'Friendly'] as const;
type Tone = (typeof tones)[number];

interface SavedCoverLetter {
  _id: string;
  jobDescription: string;
  tone: Tone;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, {
  year: 'numeric', month: 'short', day: 'numeric',
});

export default function CoverLetters() {
  const { token } = useAuth();
  const [letters, setLetters] = useState<SavedCoverLetter[]>([]);
  const [selected, setSelected] = useState<SavedCoverLetter | null>(null);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    fetch(`${API_URL}/api/cover-letter`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json() as SavedCoverLetter[] | { error?: string };
        if (!response.ok) throw new Error(!Array.isArray(data) ? data.error : 'Unable to load cover letters');
        setLetters(data as SavedCoverLetter[]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load cover letters'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const openLetter = (letter: SavedCoverLetter) => {
    setSelected(letter);
    setContent(letter.content);
    setTone(letter.tone);
    setError('');
    setNotice('');
  };

  const update = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/cover-letter/${selected._id}`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tone }),
      });
      const data = await response.json() as SavedCoverLetter | { error?: string };
      if (!response.ok) throw new Error('error' in data ? data.error : 'Unable to update cover letter');
      const updated = data as SavedCoverLetter;
      setSelected(updated);
      setLetters((current) => current.map((letter) => letter._id === updated._id ? updated : letter));
      setNotice('Cover letter updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (!selected || !window.confirm('Delete this cover letter permanently?')) return;
    setError('');
    const response = await fetch(`${API_URL}/api/cover-letter/${selected._id}`, { method: 'DELETE', headers: authHeaders });
    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error || 'Unable to delete cover letter');
      return;
    }
    setLetters((current) => current.filter((letter) => letter._id !== selected._id));
    setSelected(null);
    setNotice('Cover letter deleted.');
  };

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setNotice('Copied to clipboard.');
  };

  const downloadPdf = async () => {
    if (!selected) return;
    const { jsPDF } = await import('jspdf');
    const document = new jsPDF({ unit: 'pt', format: 'a4' });
    document.setFont('helvetica', 'normal');
    document.setFontSize(11);
    const lines = document.splitTextToSize(content, 500) as string[];
    let y = 56;
    for (const line of lines) {
      if (y > 780) { document.addPage(); y = 56; }
      document.text(line, 48, y);
      y += 16;
    }
    document.save(`cover-letter-${selected._id.slice(-6)}.pdf`);
  };

  return <main className="app-shell"><div className="dashboard-container">
    <header className="app-header"><div><p className="eyebrow">Application library</p><h1>Saved cover letters</h1><p className="subtitle">Review, edit, export, and manage your generated letters.</p></div><Link className="back-link" to="/dashboard">← Back to optimizer</Link></header>
    {error && <div className="error-message">{error}</div>}
    {notice && <div className="success-message">{notice}</div>}
    {isLoading ? <div className="analytics-state">Loading your cover letters…</div> : letters.length ? <div className="letter-library">
      <section className="letter-list" aria-label="Saved cover letters">{letters.map((letter) => <button type="button" key={letter._id} className={`letter-list-item ${selected?._id === letter._id ? 'active' : ''}`} onClick={() => openLetter(letter)}><span>{letter.tone} cover letter</span><small>{formatDate(letter.createdAt)}</small><p>{letter.jobDescription.slice(0, 100)}{letter.jobDescription.length > 100 ? '…' : ''}</p></button>)}</section>
      <section className="letter-editor">{selected ? <><div className="letter-editor-heading"><div><p className="eyebrow">Saved {formatDate(selected.createdAt)}</p><h2>Edit cover letter</h2></div><label>Tone<select value={tone} onChange={(event) => setTone(event.target.value as Tone)}>{tones.map((item) => <option key={item}>{item}</option>)}</select></label></div><textarea value={content} onChange={(event) => { setContent(event.target.value); setNotice(''); }} rows={24} aria-label="Cover letter content" /><div className="letter-actions"><button className="analyze-button" onClick={() => void update()} disabled={isSaving || !content.trim()}>{isSaving ? 'Saving…' : 'Save changes'}</button><button className="text-button" onClick={() => void copy()}>Copy</button><button className="text-button" onClick={() => void downloadPdf()}>Download PDF</button><button className="danger-button" onClick={() => void remove()}>Delete</button></div></> : <div className="letter-editor-empty"><p>Select a cover letter</p><small>Choose a saved letter to view or edit it.</small></div>}</section>
    </div> : <div className="analytics-empty saved-letters-empty"><p>No saved cover letters yet</p><small>Generate a cover letter from a resume analysis and select “Save cover letter.”</small><Link className="analyze-button" to="/dashboard">Analyze a resume</Link></div>}
  </div></main>;
}
