import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../store';
import { fetchCurrentUser, setInitialized } from '../../store/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch {
          // Error is handled in the slice
        }
      } else {
        // No token, mark as initialized
        dispatch(setInitialized());
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, token, isInitialized]);

  return children;
}