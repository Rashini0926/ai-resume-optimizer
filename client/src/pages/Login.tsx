import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: { pathname?: string }; message?: string } | null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  return <AuthLayout><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">Welcome back</p>
    <h1>Sign in to your workspace</h1>
    <p>{state?.message || 'Continue improving your applications with saved insights.'}</p>
    {error && <div className="error-message" role="alert">{error}</div>}
    <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
    <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
    <button className="analyze-button auth-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'}</button>
    <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
    <Link className="auth-back" to="/dashboard">← Continue as guest</Link>
  </form></AuthLayout>;
}
