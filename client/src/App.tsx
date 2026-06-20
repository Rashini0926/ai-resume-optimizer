import { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('checking...');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>AI Resume Optimizer</h1>
      <p>Backend status: <strong>{apiStatus}</strong></p>
    </main>
  );
}

export default App;