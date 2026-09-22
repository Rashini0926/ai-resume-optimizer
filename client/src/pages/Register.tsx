import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create account');
    } finally {
      setBusy(false);
    }
  };

  return <AuthLayout><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">Create your workspace</p>
    <h1>Start building stronger applications</h1>
    <p>Save your analyses, cover letters, and progress securely.</p>
    {error && <div className="error-message" role="alert">{error}</div>}
    <label>Full name<input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required autoComplete="name" /></label>
    <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required autoComplete="email" /></label>
    <label>Password<input type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required autoComplete="new-password" /><small>Use at least 8 characters.</small></label>
    <label>Confirm password<input type="password" minLength={8} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required autoComplete="new-password" /></label>
    <button className="analyze-button auth-submit" disabled={busy}>{busy ? 'Creating account…' : 'Create my account'}</button>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    <Link className="auth-back" to="/dashboard">← Continue as guest</Link>
  </form></AuthLayout>;
}
