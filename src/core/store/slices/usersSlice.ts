import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import type { User, ApiResponse } from '../../../shared/types/forum';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://forum-api.dicoding.dev/v1/users');

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data: ApiResponse<{ users: User[] }> = await response.json();
    return data.data.users;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch users';
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
