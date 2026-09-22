import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const powerBiUrl = 'https://app.powerbi.com/groups/me/reports/feafa6e8-6775-4ace-995b-658c6d55b6cb/1626fb51c9a4e8bdc383?experience=power-bi';

export default function AppNavigation() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const initials = currentUser?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  const signOut = () => {
    logout();
    navigate('/dashboard');
  };

  return <nav className="top-navigation" aria-label="Main navigation">
    <Link className="brand" to="/dashboard" aria-label="AI Resume Optimizer home">
      <span className="brand-mark" aria-hidden="true">AI</span>
      <span><strong>Resume Optimizer</strong><small>Career intelligence</small></span>
    </Link>

    {isAuthenticated ? <>
      <div className="nav-links">
        <NavLink to="/dashboard">Optimizer</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/cover-letters">Cover Letters</NavLink>
        {currentUser?.role === 'admin' && <NavLink to="/analytics">Analytics</NavLink>}
      </div>
      <div className="nav-account">
        {currentUser?.role === 'admin' && <button className="powerbi-link" type="button" onClick={() => window.open(powerBiUrl, '_blank', 'noopener,noreferrer')}>Power BI</button>}
        <span className="user-avatar" aria-hidden="true">{initials || 'U'}</span>
        <span className="user-meta"><strong>{currentUser?.name}</strong><small>{currentUser?.role === 'admin' ? 'Administrator' : 'Member'}</small></span>
        <button className="logout-button" type="button" onClick={signOut}>Log out</button>
      </div>
    </> : <div className="guest-actions">
      <Link className="nav-signin" to="/login">Sign in</Link>
      <Link className="nav-primary" to="/register">Create account</Link>
    </div>}
  </nav>;
}
