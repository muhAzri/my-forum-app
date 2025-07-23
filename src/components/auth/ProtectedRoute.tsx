import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import type { RootState } from '../../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Show loading while auth is being initialized
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}