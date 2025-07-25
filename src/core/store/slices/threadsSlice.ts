import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import type {
  ThreadsState, Thread, ThreadDetail, Comment, ApiResponse, AuthState,
} from '../../../shared/types/forum';

const initialState: ThreadsState = {
  threads: [],
  currentThread: null,
  categories: [],
  selectedCategory: null,
  isLoading: false,
  isVoting: false,
  isCreating: false,
  error: null,
};

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async () => {
    const response = await fetch('https://forum-api.dicoding.dev/v1/threads');

    if (!response.ok) {
      throw new Error('Failed to fetch threads');
    }

    const data: ApiResponse<{ threads: Thread[] }> = await response.json();
    return data.data.threads;
  },
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchThreadDetail',
  async (threadId: string) => {
    const response = await fetch(`https://forum-api.dicoding.dev/v1/threads/${threadId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch thread detail');
    }

    const data: ApiResponse<{ detailThread: ThreadDetail }> = await response.json();
    return data.data.detailThread;
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (
    threadData: { title: string; body: string; category?: string },
    { getState },
  ) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) {
      throw new Error('Authentication required');
    }

    const response = await fetch('https://forum-api.dicoding.dev/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(threadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create thread');
    }

    const data: ApiResponse<{ thread: Thread }> = await response.json();
    return data.data.thread;
  },
);

export const createComment = createAsyncThunk(
  'threads/createComment',
  async (
    { threadId, content }: { threadId: string; content: string },
    { getState },
  ) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`https://forum-api.dicoding.dev/v1/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    const data: ApiResponse<{ comment: Comment }> = await response.json();
    return data.data.comment;
  },
);

export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async (
    { threadId, voteType }: { threadId: string; voteType: 'up' | 'down' | 'neutral' },
    { getState },
  ) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`https://forum-api.dicoding.dev/v1/threads/${threadId}/${voteType}-vote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to vote thread');
    }

    return { threadId, voteType, userId: auth.user?.id };
  },
);

export const voteComment = createAsyncThunk(
  'threads/voteComment',
  async (
    {
      threadId,
      commentId,
      voteType,
    }: {
      threadId: string;
      commentId: string;
      voteType: 'up' | 'down' | 'neutral'
    },
    { getState },
  ) => {
    const { auth } = getState() as { auth: AuthState };

    if (!auth.token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `https://forum-api.dicoding.dev/v1/threads/${threadId}/comments/${commentId}/${voteType}-vote`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to vote comment');
    }

    return {
      threadId, commentId, voteType, userId: auth.user?.id,
    };
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearCurrentThread: (state) => {
      state.currentThread = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    optimisticVoteThread: (state, action: PayloadAction<{ threadId: string; voteType: 'up' | 'down' | 'neutral'; userId: string }>) => {
      const { threadId, voteType, userId } = action.payload;

      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

        if (voteType === 'up') {
          thread.upVotesBy.push(userId);
        } else if (voteType === 'down') {
          thread.downVotesBy.push(userId);
        }
      }

      if (state.currentThread && state.currentThread.id === threadId) {
        state.currentThread.upVotesBy = state.currentThread.upVotesBy.filter(
          (id) => id !== userId,
        );
        state.currentThread.downVotesBy = state.currentThread.downVotesBy.filter(
          (id) => id !== userId,
        );

        if (voteType === 'up') {
          state.currentThread.upVotesBy.push(userId);
        } else if (voteType === 'down') {
          state.currentThread.downVotesBy.push(userId);
        }
      }
    },
    optimisticVoteComment: (state, action: PayloadAction<{ commentId: string; voteType: 'up' | 'down' | 'neutral'; userId: string }>) => {
      const { commentId, voteType, userId } = action.payload;

      if (!state.currentThread) { return; }

      const comment = state.currentThread.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);

        if (voteType === 'up') {
          comment.upVotesBy.push(userId);
        } else if (voteType === 'down') {
          comment.downVotesBy.push(userId);
        }
      }
    },
    rollbackVoteThread: (
      state,
      action: PayloadAction<{
        threadId: string;
        previousUpVotes: string[];
        previousDownVotes: string[];
      }>,
    ) => {
      const { threadId, previousUpVotes, previousDownVotes } = action.payload;

      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        thread.upVotesBy = previousUpVotes;
        thread.downVotesBy = previousDownVotes;
      }

      if (state.currentThread && state.currentThread.id === threadId) {
        state.currentThread.upVotesBy = previousUpVotes;
        state.currentThread.downVotesBy = previousDownVotes;
      }
    },
    rollbackVoteComment: (
      state,
      action: PayloadAction<{
        commentId: string;
        previousUpVotes: string[];
        previousDownVotes: string[];
      }>,
    ) => {
      const { commentId, previousUpVotes, previousDownVotes } = action.payload;

      if (!state.currentThread) { return; }

      const comment = state.currentThread.comments.find((c) => c.id === commentId);
      if (comment) {
        comment.upVotesBy = previousUpVotes;
        comment.downVotesBy = previousDownVotes;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action: PayloadAction<Thread[]>) => {
        state.isLoading = false;
        state.threads = action.payload;

        const categories = Array.from(
          new Set(action.payload.map((thread) => thread.category).filter(Boolean)),
        );
        state.categories = categories;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch threads';
      })
      .addCase(fetchThreadDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action: PayloadAction<ThreadDetail>) => {
        state.isLoading = false;
        state.currentThread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to fetch thread detail';
      })
      .addCase(createThread.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action: PayloadAction<Thread>) => {
        state.isCreating = false;
        state.threads.unshift(action.payload);

        if (!state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
      })
      .addCase(createThread.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message ?? 'Failed to create thread';
      })
      .addCase(createComment.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.isCreating = false;
        if (state.currentThread) {
          state.currentThread.comments.push(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message ?? 'Failed to create comment';
      })
      .addCase(voteThread.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(voteThread.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to vote on thread';
      })
      .addCase(voteComment.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(voteComment.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to vote on comment';
      });
  },
});

export const {
  setSelectedCategory,
  clearCurrentThread,
  clearError,
  optimisticVoteThread,
  optimisticVoteComment,
  rollbackVoteThread,
  rollbackVoteComment,
} = threadsSlice.actions;
export default threadsSlice.reducer;
