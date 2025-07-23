import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import type { LeaderboardState, LeaderboardEntry, ApiResponse } from '../../types/forum';

const initialState: LeaderboardState = {
  leaderboards: [],
  isLoading: false,
  error: null,
};

export const fetchLeaderboards = createAsyncThunk(
  'leaderboard/fetchLeaderboards',
  async () => {
    const response = await fetch('https://forum-api.dicoding.dev/v1/leaderboards');

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboards');
    }

    const data: ApiResponse<{ leaderboards: LeaderboardEntry[] }> = await response.json();
    return data.data.leaderboards;
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action: PayloadAction<LeaderboardEntry[]>) => {
        state.isLoading = false;
        state.leaderboards = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch leaderboards';
      });
  },
});

export const { clearError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;