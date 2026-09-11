import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="auth-loading">Checking access…</div>;
  return currentUser?.role === 'admin'
    ? <Outlet />
    : <Navigate to="/dashboard" replace state={{ from: location, message: 'Administrator access is required.' }} />;
}
