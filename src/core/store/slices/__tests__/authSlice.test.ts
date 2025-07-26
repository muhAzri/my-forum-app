/**
 * Skenario Test
 *
 * - authSlice reducer tests
 *   - should return initial state
 *   - loginUser async action
 *     - should handle login pending state
 *     - should handle login fulfilled state
 *     - should handle login rejected state
 *   - should handle logout action with complete state reset
 *   - fetchCurrentUser with complex conditions
 *     - should handle fetchCurrentUser fulfilled state
 *     - should handle fetchCurrentUser rejected with token cleanup
 *     - should handle no token available error differently
 *   - should handle registerUser fulfilled state
 *   - should handle clearError action
 *   - should handle setInitialized action
 */

import type { AuthState } from '../../../../shared/types/forum';
import authReducer, {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logout,
  clearError,
  setInitialized,
} from '../authSlice';

describe('authSlice reducer tests', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isInitialized: false,
  };

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'avatar.jpg',
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    localStorage.clear();
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    jest.clearAllMocks();
  });

  test('should return initial state', () => {
    const actualState = authReducer(undefined, { type: 'unknown' });
    expect(actualState).toEqual({
      ...initialState,
      token: actualState.token,
    });
  });

  describe('loginUser async action', () => {
    test('should handle login pending state', () => {
      const action = { type: loginUser.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    test('should handle login fulfilled state', () => {
      const action = { type: loginUser.fulfilled.type, payload: mockToken };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.token).toBe(mockToken);
      expect(state.error).toBe(null);
    });

    test('should handle login rejected state', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage },
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.token).toBe(null);
    });
  });

  test('should handle logout action with complete state reset', () => {
    const loggedInState: AuthState = {
      user: mockUser,
      token: mockToken,
      isLoading: false,
      error: 'Some previous error',
      isInitialized: false,
    };

    const action = logout();
    const state = authReducer(loggedInState, action);

    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.error).toBe(null);
    expect(state.isInitialized).toBe(true);
  });

  describe('fetchCurrentUser with complex conditions', () => {
    test('should handle fetchCurrentUser fulfilled state', () => {
      const stateWithToken: AuthState = {
        ...initialState,
        token: mockToken,
        isLoading: true,
      };

      const action = {
        type: fetchCurrentUser.fulfilled.type,
        payload: mockUser,
      };
      const state = authReducer(stateWithToken, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isInitialized).toBe(true);
    });

    test('should handle fetchCurrentUser rejected with token cleanup', () => {
      const stateWithToken: AuthState = {
        ...initialState,
        token: mockToken,
        isLoading: true,
      };

      const action = {
        type: fetchCurrentUser.rejected.type,
        error: { message: 'Unauthorized - token expired' },
      };
      const state = authReducer(stateWithToken, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toContain('Unauthorized');
      expect(state.isInitialized).toBe(true);
      expect(state.token).toBe(null);
      expect(state.user).toBe(null);
    });

    test('should handle no token available error differently', () => {
      const action = {
        type: fetchCurrentUser.rejected.type,
        error: { message: 'No token available' },
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('No token available');
      expect(state.isInitialized).toBe(true);
      expect(state.token).toBe(null);
    });
  });

  test('should handle registerUser fulfilled state', () => {
    const action = { type: registerUser.fulfilled.type };
    const state = authReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('should handle clearError action', () => {
    const stateWithError: AuthState = {
      ...initialState,
      error: 'Some error',
    };

    const action = clearError();
    const state = authReducer(stateWithError, action);

    expect(state.error).toBe(null);
  });

  test('should handle setInitialized action', () => {
    const action = setInitialized();
    const state = authReducer(initialState, action);

    expect(state.isInitialized).toBe(true);
  });
});
