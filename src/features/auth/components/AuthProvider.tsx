import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/AuthTypes';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Export both hooks for flexibility
export { useAuth } from '../hooks/useAuth';