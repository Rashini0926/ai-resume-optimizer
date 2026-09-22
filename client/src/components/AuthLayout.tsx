import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="auth-page">
    <div className="auth-layout">
      <aside className="auth-intro">
        <Link className="brand brand-light" to="/dashboard">
          <span className="brand-mark">AI</span>
          <span><strong>Resume Optimizer</strong><small>Career intelligence</small></span>
        </Link>
        <div>
          <p className="eyebrow">Your application workspace</p>
          <h2>Turn every application into a stronger opportunity.</h2>
          <p>Analyze role fit, discover missing keywords, build tailored cover letters, and track your progress in one secure workspace.</p>
        </div>
        <ul className="auth-benefits">
          <li><span>✓</span> ATS-focused resume insights</li>
          <li><span>✓</span> Personalized cover letters</li>
          <li><span>✓</span> Private application history</li>
        </ul>
      </aside>
      <section className="auth-form-panel">{children}</section>
    </div>
  </main>;
}
