import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="auth-loading">Checking your session…</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
