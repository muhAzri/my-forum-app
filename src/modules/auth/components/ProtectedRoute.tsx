import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import type { RootState } from '../../../core/store';
import Spinner from '../../../shared/components/atoms/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}
