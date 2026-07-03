import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './worklink/LoadingSpinner';

interface RequireAuthProps {
  children: React.ReactElement;
  requiredRole?: 'worker' | 'customer' | 'admin';
}

export function RequireAuth({ children, requiredRole }: RequireAuthProps) {
  const { isAuthenticated, isLoading, user } = useAuth() as any;
  const location = useLocation();

  if (isLoading) return <LoadingSpinner text="Checking authentication..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAuth;
