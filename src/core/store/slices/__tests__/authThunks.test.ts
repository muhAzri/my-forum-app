/**
 * Skenario Test
 *
 * - Auth Thunk Functions Tests
 *   - loginUser thunk with complex scenarios
 *     - should handle successful login with proper token storage
 *     - should handle login failure with proper error message
 *     - should handle network error during login
 *     - should handle malformed API response
 *   - registerUser thunk with validation scenarios
 *     - should handle successful registration
 *     - should handle registration failure (duplicate email)
 *   - fetchCurrentUser thunk with authentication states
 *     - should successfully fetch user with valid token
 *     - should handle fetchCurrentUser with no token
 *     - should handle expired token (401 response) with cleanup
 *   - integration tests with multiple thunks
 *     - should handle login followed by fetchCurrentUser flow
 *     - should handle error state persistence across failed thunks
 */

import { configureStore } from '@reduxjs/toolkit';

import type { AuthState as _AuthState } from '../../../../shared/types/forum';
import authReducer, { loginUser, registerUser, fetchCurrentUser } from '../authSlice';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Auth Thunk Functions Tests', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: null,
          isInitialized: false,
        },
      },
    });

    mockFetch.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  describe('loginUser thunk with complex scenarios', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    test('should handle successful login with proper token storage', async () => {
      const mockToken = 'mock-jwt-token-12345';
      const mockResponse = {
        status: 'success',
        data: { token: mockToken },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await store.dispatch(loginUser(mockCredentials));

      expect(result.type).toBe('auth/login/fulfilled');
      expect(result.payload).toBe(mockToken);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockCredentials),
        },
      );

      const state = store.getState().auth;
      expect(state.token).toBe(mockToken);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('should handle login failure with proper error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await store.dispatch(loginUser(mockCredentials));

      expect(result.type).toBe('auth/login/rejected');
      expect(result.error.message).toBe('Login failed');

      const state = store.getState().auth;
      expect(state.token).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Login failed');
    });

    test('should handle network error during login', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await store.dispatch(loginUser(mockCredentials));

      expect(result.type).toBe('auth/login/rejected');
      expect(result.error.message).toBe('Network error');
    });

    test('should handle malformed API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
      });

      const result = await store.dispatch(loginUser(mockCredentials));

      expect(result.type).toBe('auth/login/rejected');
      expect(result.error.message).toBe('Invalid JSON');
    });
  });

  describe('registerUser thunk with validation scenarios', () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePassword123',
    };

    test('should handle successful registration', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'default.jpg',
      };
      const mockResponse = {
        status: 'success',
        data: { user: mockUser },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await store.dispatch(registerUser(mockUserData));

      expect(result.type).toBe('auth/register/fulfilled');
      expect(result.payload).toEqual(mockUser);

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('should handle registration failure (duplicate email)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await store.dispatch(registerUser(mockUserData));

      expect(result.type).toBe('auth/register/rejected');
      expect(result.error.message).toBe('Registration failed');

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Registration failed');
    });
  });

  describe('fetchCurrentUser thunk with authentication states', () => {
    test('should successfully fetch user with valid token', async () => {
      const mockToken = 'valid-token-123';
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'avatar.jpg',
      };
      const mockResponse = {
        status: 'success',
        data: { user: mockUser },
      };

      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: null,
            token: mockToken,
            isLoading: false,
            error: null,
            isInitialized: false,
          },
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await store.dispatch(fetchCurrentUser());

      expect(result.type).toBe('auth/fetchCurrentUser/fulfilled');
      expect(result.payload).toEqual(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/users/me',
        {
          headers: { Authorization: `Bearer ${mockToken}` },
        },
      );

      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isInitialized).toBe(true);
    });

    test('should handle fetchCurrentUser with no token', async () => {
      const result = await store.dispatch(fetchCurrentUser());

      expect(result.type).toBe('auth/fetchCurrentUser/rejected');
      expect(result.error.message).toBe('No token available');
      expect(mockFetch).not.toHaveBeenCalled();

      const state = store.getState().auth;
      expect(state.isInitialized).toBe(true);
    });

    test('should handle expired token (401 response) with cleanup', async () => {
      const expiredToken = 'expired-token-123';

      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: null,
            token: expiredToken,
            isLoading: false,
            error: null,
            isInitialized: false,
          },
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await store.dispatch(fetchCurrentUser());

      expect(result.type).toBe('auth/fetchCurrentUser/rejected');
      expect(result.error.message).toBe('Unauthorized - token expired');

      const state = store.getState().auth;
      expect(state.token).toBeFalsy();
      expect(state.user).toBe(null);
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('integration tests with multiple thunks', () => {
    test('should handle login followed by fetchCurrentUser flow', async () => {
      const mockToken = 'integration-token-123';
      const mockUser = {
        id: '1',
        name: 'Integration User',
        email: 'integration@example.com',
        avatar: 'integration.jpg',
      };

      // Mock login response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          status: 'success',
          data: { token: mockToken },
        }),
      });

      // Mock fetchCurrentUser response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          status: 'success',
          data: { user: mockUser },
        }),
      });

      const loginResult = await store.dispatch(loginUser({
        email: 'integration@example.com',
        password: 'password123',
      }));

      expect(loginResult.type).toBe('auth/login/fulfilled');
      expect(store.getState().auth.token).toBe(mockToken);

      const fetchResult = await store.dispatch(fetchCurrentUser());

      expect(fetchResult.type).toBe('auth/fetchCurrentUser/fulfilled');

      const finalState = store.getState().auth;
      expect(finalState.user).toEqual(mockUser);
      expect(finalState.token).toBe(mockToken);
      expect(finalState.isInitialized).toBe(true);
      expect(finalState.error).toBe(null);
    });

    test('should handle error state persistence across failed thunks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const loginResult = await store.dispatch(loginUser({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }));

      expect(loginResult.type).toBe('auth/login/rejected');
      expect(store.getState().auth.error).toBe('Login failed');

      const fetchResult = await store.dispatch(fetchCurrentUser());

      expect(fetchResult.type).toBe('auth/fetchCurrentUser/rejected');

      const finalState = store.getState().auth;
      expect(finalState.error).toBe('No token available');
      expect(finalState.user).toBe(null);
      expect(finalState.token).toBe(null);
      expect(finalState.isInitialized).toBe(true);
    });
  });
});
