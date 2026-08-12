import { useEffect, useState } from "react";
import AnalyzeForm from "./components/AnalyzeForm";
import HistoryTable, { type HistoryItem } from "./components/HistoryTable";
import ResultCard from "./components/ResultCard";
import type { AnalysisResult } from "./types";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);
      if (!response.ok) throw new Error("Unable to load analysis history");
      const data: HistoryItem[] | { data?: HistoryItem[] } = await response.json();
      setHistory(Array.isArray(data) ? data : data.data ?? []);
    } catch (loadError) {
      console.error(loadError);
    }
  };

  useEffect(() => {
    // History is fetched asynchronously on the initial page load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadHistory();
  }, []);

  const openDashboard = () => {
    window.open("https://app.powerbi.com/groups/me/reports/feafa6e8-6775-4ace-995b-658c6d55b6cb/1626fb51c9a4e8bdc383?experience=power-bi", "_blank", "noopener,noreferrer");
  };

  const handleAnalyze = async (resumeText: string, jobDescription: string) => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, userId: "user-1", industry: "Software Development", jobRole: "Software Engineer" }),
      });
      if (!response.ok) throw new Error("Analysis failed. Please try again.");
      setResult(await response.json() as AnalysisResult);
      await loadHistory();
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="dashboard-container">
        <header className="app-header">
          <div>
            <p className="eyebrow">Career intelligence</p>
            <h1>AI Resume Optimizer</h1>
            <p className="subtitle">Compare your resume to a role and get clear, ATS-focused improvements in seconds.</p>
          </div>
          <button className="dashboard-button" type="button" onClick={openDashboard}>
            <span aria-hidden="true">▦</span> Power BI Dashboard
          </button>
        </header>

        {!result && <AnalyzeForm onSubmit={handleAnalyze} isLoading={isLoading} />}

        {error && <div className="error-message" role="alert">{error}</div>}

        {result && (
          <section className="results-section" aria-live="polite">
            <div className="results-heading">
              <div><p className="eyebrow">Analysis complete</p><h2>Your resume insights</h2></div>
              <button className="text-button" type="button" onClick={() => setResult(null)}>Analyze another resume</button>
            </div>
            <ResultCard result={result} />
          </section>
        )}

        <HistoryTable items={history} />
      </div>
    </main>
  );
}

export default App;
