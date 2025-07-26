import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, User, ApiResponse } from '../../../shared/types/forum';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('https://forum-api.dicoding.dev/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: ApiResponse<{ token: string }> = await response.json();
    return data.data.token;
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch('https://forum-api.dicoding.dev/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: ApiResponse<{ user: User }> = await response.json();
    return data.data.user;
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) {
      throw new Error('No token available');
    }

    const response = await fetch('https://forum-api.dicoding.dev/v1/users/me', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - token expired');
      }
      throw new Error('Failed to fetch user');
    }

    const data: ApiResponse<{ user: User }> = await response.json();
    return data.data.user;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isInitialized = true;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.token = action.payload;
        state.error = null;
        localStorage.setItem('token', action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Registration failed';
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch user';
        state.isInitialized = true;
        if (action.error.message === 'No token available' || action.error.message === 'Unauthorized - token expired') {
          state.token = null;
          state.user = null;
          localStorage.removeItem('token');
        }
      });
  },
});

export const { logout, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
