import { configureStore } from '@reduxjs/toolkit';

import type { Thread, ThreadDetail, Comment } from '../../../../shared/types/forum';
import authReducer from '../authSlice';
import threadsReducer, {
  fetchThreads,
  fetchThreadDetail,
  createThread,
  createComment,
  voteThread,
  voteComment,
} from '../threadsSlice';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Threads Thunk Functions Tests', () => {
  let store: any;

  const mockThread: Thread = {
    id: 'thread-1',
    title: 'Test Thread',
    body: 'Test thread content',
    category: 'general',
    createdAt: '2024-01-01T00:00:00Z',
    ownerId: 'user-1',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 2,
  };

  const mockThreadDetail: ThreadDetail = {
    id: 'thread-1',
    title: 'Test Thread',
    body: 'Test thread content',
    category: 'general',
    createdAt: '2024-01-01T00:00:00Z',
    totalComments: 1,
    owner: {
      id: 'user-1',
      name: 'Thread Owner',
      email: 'owner@example.com',
      avatar: 'owner.jpg',
    },
    upVotesBy: ['user-2'],
    downVotesBy: [],
    comments: [
      {
        id: 'comment-1',
        content: 'First comment',
        createdAt: '2024-01-01T01:00:00Z',
        owner: {
          id: 'user-2',
          name: 'Commenter',
          email: 'commenter@example.com',
          avatar: 'commenter.jpg',
        },
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  };

  const mockAuthenticatedUser = {
    id: 'user-123',
    name: 'Authenticated User',
    email: 'auth@example.com',
    avatar: 'auth.jpg',
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: authReducer,
      },
      preloadedState: {
        threads: {
          threads: [],
          currentThread: null,
          categories: [],
          selectedCategory: null,
          isLoading: false,
          isVoting: false,
          isCreating: false,
          error: null,
        },
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: null,
          isInitialized: true,
        },
      },
    });

    mockFetch.mockClear();
  });

  describe('fetchThreads thunk with complex data scenarios', () => {
    test('should handle successful threads fetch with data transformation', async () => {
      const mockThreadsResponse = {
        status: 'success',
        data: {
          threads: [
            mockThread,
            { ...mockThread, id: 'thread-2', category: 'tech' },
            { ...mockThread, id: 'thread-3', category: 'sports' },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockThreadsResponse),
      });

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe('threads/fetchThreads/fulfilled');
      expect(result.payload).toEqual(mockThreadsResponse.data.threads);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/threads',
      );

      const state = store.getState().threads;
      expect(state.threads).toHaveLength(3);
      expect(state.categories).toEqual(['general', 'tech', 'sports']);
      expect(state.isLoading).toBe(false);
    });

    test('should handle empty threads response', async () => {
      const emptyResponse = {
        status: 'success',
        data: { threads: [] },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(emptyResponse),
      });

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe('threads/fetchThreads/fulfilled');
      expect(result.payload).toEqual([]);

      const state = store.getState().threads;
      expect(state.threads).toHaveLength(0);
      expect(state.categories).toHaveLength(0);
    });

    test('should handle fetchThreads network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network unavailable'));

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe('threads/fetchThreads/rejected');
      expect(result.error.message).toBe('Network unavailable');

      const state = store.getState().threads;
      expect(state.error).toBe('Network unavailable');
      expect(state.isLoading).toBe(false);
    });

    test('should handle malformed API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await store.dispatch(fetchThreads());

      expect(result.type).toBe('threads/fetchThreads/rejected');
      expect(result.error.message).toBe('Failed to fetch threads');
    });
  });

  describe('createThread thunk with authentication dependencies', () => {
    const mockThreadData = {
      title: 'New Thread',
      body: 'New thread content',
      category: 'general',
    };

    test('should successfully create thread with authentication', async () => {
      const mockToken = 'auth-token-123';

      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer },
        preloadedState: {
          threads: {
            threads: [],
            currentThread: null,
            categories: [],
            selectedCategory: null,
            isLoading: false,
            isVoting: false,
            isCreating: false,
            error: null,
          },
          auth: {
            user: mockAuthenticatedUser,
            token: mockToken,
            isLoading: false,
            error: null,
            isInitialized: true,
          },
        },
      });

      const createdThread: Thread = {
        ...mockThread,
        id: 'new-thread-1',
        title: 'New Thread',
        body: 'New thread content',
        ownerId: mockAuthenticatedUser.id,
      };

      const mockResponse = {
        status: 'success',
        data: { thread: createdThread },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await store.dispatch(createThread(mockThreadData));

      expect(result.type).toBe('threads/createThread/fulfilled');
      expect(result.payload).toEqual(createdThread);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/threads',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockThreadData),
        },
      );

      const state = store.getState().threads;
      expect(state.threads[0]).toEqual(createdThread);
      expect(state.isCreating).toBe(false);
    });

    test('should fail to create thread without authentication', async () => {
      const result = await store.dispatch(createThread(mockThreadData));

      expect(result.type).toBe('threads/createThread/rejected');
      expect(result.error.message).toBe('Authentication required');
      expect(mockFetch).not.toHaveBeenCalled();

      const state = store.getState().threads;
      expect(state.error).toBe('Authentication required');
      expect(state.isCreating).toBe(false);
    });

    test('should handle server validation errors', async () => {
      const mockToken = 'auth-token-123';

      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer },
        preloadedState: {
          threads: {
            threads: [],
            currentThread: null,
            categories: [],
            selectedCategory: null,
            isLoading: false,
            isVoting: false,
            isCreating: false,
            error: null,
          },
          auth: {
            user: mockAuthenticatedUser,
            token: mockToken,
            isLoading: false,
            error: null,
            isInitialized: true,
          },
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const result = await store.dispatch(createThread(mockThreadData));

      expect(result.type).toBe('threads/createThread/rejected');
      expect(result.error.message).toBe('Failed to create thread');
    });
  });

  describe('voting thunks with complex state management', () => {
    const mockToken = 'auth-token-123';

    beforeEach(() => {
      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer },
        preloadedState: {
          threads: {
            threads: [mockThread],
            currentThread: mockThreadDetail,
            categories: ['general'],
            selectedCategory: null,
            isLoading: false,
            isVoting: false,
            isCreating: false,
            error: null,
          },
          auth: {
            user: mockAuthenticatedUser,
            token: mockToken,
            isLoading: false,
            error: null,
            isInitialized: true,
          },
        },
      });
    });

    test('should successfully vote on thread with authentication', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      const voteData = {
        threadId: 'thread-1',
        voteType: 'up' as const,
      };

      const result = await store.dispatch(voteThread(voteData));

      expect(result.type).toBe('threads/voteThread/fulfilled');
      expect(result.payload).toEqual({
        threadId: 'thread-1',
        voteType: 'up',
        userId: mockAuthenticatedUser.id,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/threads/thread-1/up-vote',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${mockToken}` },
        },
      );
    });

    test('should handle vote switching scenarios', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      const downVoteData = {
        threadId: 'thread-1',
        voteType: 'down' as const,
      };

      const downVoteResult = await store.dispatch(voteThread(downVoteData));

      expect(downVoteResult.type).toBe('threads/voteThread/fulfilled');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/threads/thread-1/down-vote',
        expect.any(Object),
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      const neutralVoteData = {
        threadId: 'thread-1',
        voteType: 'neutral' as const,
      };

      const neutralVoteResult = await store.dispatch(voteThread(neutralVoteData));

      expect(neutralVoteResult.type).toBe('threads/voteThread/fulfilled');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/threads/thread-1/neutral-vote',
        expect.any(Object),
      );
    });

    test('should successfully vote on comment', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });

      const commentVoteData = {
        threadId: 'thread-1',
        commentId: 'comment-1',
        voteType: 'up' as const,
      };

      const result = await store.dispatch(voteComment(commentVoteData));

      expect(result.type).toBe('threads/voteComment/fulfilled');
      expect(result.payload).toEqual({
        threadId: 'thread-1',
        commentId: 'comment-1',
        voteType: 'up',
        userId: mockAuthenticatedUser.id,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://forum-api.dicoding.dev/v1/threads/thread-1/comments/comment-1/up-vote',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${mockToken}` },
        },
      );
    });

    test('should fail voting without authentication', async () => {
      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer },
        preloadedState: {
          threads: {
            threads: [mockThread],
            currentThread: mockThreadDetail,
            categories: ['general'],
            selectedCategory: null,
            isLoading: false,
            isVoting: false,
            isCreating: false,
            error: null,
          },
          auth: {
            user: null,
            token: null,
            isLoading: false,
            error: null,
            isInitialized: true,
          },
        },
      });

      const voteData = {
        threadId: 'thread-1',
        voteType: 'up' as const,
      };

      const result = await store.dispatch(voteThread(voteData));

      expect(result.type).toBe('threads/voteThread/rejected');
      expect(result.error.message).toBe('Authentication required');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('integration tests with multiple related thunks', () => {
    test('should handle fetchThreadDetail followed by createComment', async () => {
      const mockToken = 'integration-token-123';

      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer },
        preloadedState: {
          threads: {
            threads: [],
            currentThread: null,
            categories: [],
            selectedCategory: null,
            isLoading: false,
            isVoting: false,
            isCreating: false,
            error: null,
          },
          auth: {
            user: mockAuthenticatedUser,
            token: mockToken,
            isLoading: false,
            error: null,
            isInitialized: true,
          },
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          status: 'success',
          data: { detailThread: mockThreadDetail },
        }),
      });

      const fetchResult = await store.dispatch(fetchThreadDetail('thread-1'));
      expect(fetchResult.type).toBe('threads/fetchThreadDetail/fulfilled');
      expect(store.getState().threads.currentThread).toEqual(mockThreadDetail);

      const newComment: Comment = {
        id: 'comment-2',
        content: 'Integration test comment',
        createdAt: '2024-01-01T02:00:00Z',
        owner: mockAuthenticatedUser,
        upVotesBy: [],
        downVotesBy: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          status: 'success',
          data: { comment: newComment },
        }),
      });

      const commentResult = await store.dispatch(createComment({
        threadId: 'thread-1',
        content: 'Integration test comment',
      }));

      expect(commentResult.type).toBe('threads/createComment/fulfilled');

      const finalState = store.getState().threads;
      expect(finalState.currentThread?.comments).toHaveLength(2);
      expect(finalState.currentThread?.comments[1]).toEqual(newComment);
      expect(finalState.isCreating).toBe(false);
    });

    test('should handle error propagation across multiple failed actions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const fetchResult = await store.dispatch(fetchThreadDetail('nonexistent'));
      expect(fetchResult.type).toBe('threads/fetchThreadDetail/rejected');
      expect(store.getState().threads.error).toBe('Failed to fetch thread detail');

      const createResult = await store.dispatch(createThread({
        title: 'Test',
        body: 'Test',
        category: 'test',
      }));

      expect(createResult.type).toBe('threads/createThread/rejected');

      const finalState = store.getState().threads;
      expect(finalState.error).toBe('Authentication required');
      expect(finalState.currentThread).toBe(null);
      expect(finalState.threads).toHaveLength(0);
    });
  });
});
