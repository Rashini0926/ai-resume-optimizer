import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute() { const { isAuthenticated, isLoading } = useAuth(); const location = useLocation(); if (isLoading) return <div className="auth-loading">Checking your session…</div>; return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />; }
