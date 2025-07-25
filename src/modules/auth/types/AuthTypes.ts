export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface IAuthService {
  login(_credentials: LoginCredentials): Promise<{ user: User; token: string }>;
  register(_data: RegisterData): Promise<User>;
  getCurrentUser(): Promise<User>;
  logout(): Promise<void>;
  getToken(): string | null;
  setToken(_token: string | null): void;
}

export interface AuthContextValue extends AuthState {
  login: (_credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (_data: RegisterData) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}
