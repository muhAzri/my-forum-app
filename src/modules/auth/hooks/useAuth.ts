import { useState, useEffect, useCallback } from 'react';

import { container } from '../../../core/Container';
import type { IAuthService, LoginCredentials, RegisterData, AuthState } from '../types/AuthTypes';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const authService = container.resolve<IAuthService>('AuthService');

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const { user, token } = await authService.login(credentials);

      setState((prev) => ({
        ...prev,
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [authService, setLoading, setError]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const user = await authService.register(data);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));

      return { success: true, user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [authService, setLoading, setError]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  }, [authService, setError]);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      const token = authService.getToken();

      setState((prev) => ({
        ...prev,
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get user',
      }));
    }
  }, [authService, setLoading]);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      getCurrentUser();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [authService, getCurrentUser]);

  return {
    ...state,
    login,
    register,
    logout,
    getCurrentUser,
  };
}