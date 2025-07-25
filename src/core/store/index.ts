import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import leaderboardReducer from './slices/leaderboardSlice';
import threadsReducer from './slices/threadsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    leaderboard: leaderboardReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
