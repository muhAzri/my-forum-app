import type {
  IAuthService, User, LoginCredentials, RegisterData,
} from '../types/AuthTypes';

export class AuthService implements IAuthService {
  private readonly baseURL = 'https://forum-api.dicoding.dev/v1';

  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Login failed');
    }

    const data = await response.json();
    const { token } = data.data;

    this.setToken(token);

    const user = await this.getCurrentUser();

    return { user, token };
  }

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Registration failed');
    }

    const result = await response.json();
    return result.data.user;
  }

  async getCurrentUser(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${this.baseURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    const data = await response.json();
    return data.data.user;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
}
