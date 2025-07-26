/**
 * Skenario Test
 *
 * - threadsSlice reducer tests
 *   - should return correct initial state with all properties
 *   - fetchThreads with complex category extraction
 *     - should handle fetchThreads fulfilled with category extraction
 *     - should handle fetchThreads rejected with error message
 *   - optimistic voting with complex state management
 *     - should handle optimistic thread voting - switching from neutral to up
 *     - should handle optimistic thread voting - switching from up to down
 *     - should handle optimistic comment voting
 *     - should handle rollback thread vote
 *   - createThread with category management
 *     - should handle createThread fulfilled with new category
 *     - should handle createThread fulfilled with existing category
 *   - complex state interactions
 *     - should handle createComment fulfilled updating currentThread
 *     - should handle multiple synchronous actions
 *     - should handle fetchThreadDetail when currentThread already exists
 */

import type {
  ThreadsState, Thread, ThreadDetail, Comment,
} from '../../../../shared/types/forum';
import threadsReducer, {
  fetchThreads,
  fetchThreadDetail,
  createThread,
  createComment,
  voteThread as _voteThread,
  setSelectedCategory,
  clearCurrentThread,
  clearError,
  optimisticVoteThread,
  optimisticVoteComment,
  rollbackVoteThread,
  rollbackVoteComment as _rollbackVoteComment,
} from '../threadsSlice';

describe('threadsSlice reducer tests', () => {
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

  const mockThread: Thread = {
    id: 'thread-1',
    title: 'Test Thread',
    body: 'Test content',
    category: 'general',
    createdAt: '2024-01-01T00:00:00Z',
    ownerId: 'user-1',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 5,
  };

  const mockThreadDetail: ThreadDetail = {
    id: 'thread-1',
    title: 'Test Thread',
    body: 'Test content',
    category: 'general',
    createdAt: '2024-01-01T00:00:00Z',
    totalComments: 1,
    owner: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg',
    },
    upVotesBy: ['user-2'],
    downVotesBy: [],
    comments: [
      {
        id: 'comment-1',
        content: 'Test comment',
        createdAt: '2024-01-01T01:00:00Z',
        owner: {
          id: 'user-2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          avatar: 'avatar2.jpg',
        },
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  };

  const mockComment: Comment = {
    id: 'comment-2',
    content: 'New comment',
    createdAt: '2024-01-01T02:00:00Z',
    owner: {
      id: 'user-3',
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'avatar3.jpg',
    },
    upVotesBy: [],
    downVotesBy: [],
  };

  test('should return correct initial state with all properties', () => {
    expect(threadsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchThreads with complex category extraction', () => {
    test('should handle fetchThreads fulfilled with category extraction', () => {
      const threadsWithCategories: Thread[] = [
        { ...mockThread, category: 'general' },
        { ...mockThread, id: 'thread-2', category: 'tech' },
        { ...mockThread, id: 'thread-3', category: 'general' }, // duplicate category
        { ...mockThread, id: 'thread-4', category: 'sports' },
      ];

      const action = {
        type: fetchThreads.fulfilled.type,
        payload: threadsWithCategories,
      };
      const state = threadsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.threads).toEqual(threadsWithCategories);
      expect(state.categories).toEqual(['general', 'tech', 'sports']);
    });

    test('should handle fetchThreads rejected with error message', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchThreads.rejected.type,
        error: { message: errorMessage },
      };
      const state = threadsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.threads).toEqual([]);
    });
  });

  describe('optimistic voting with complex state management', () => {
    const userId = 'user-123';
    const stateWithThreads: ThreadsState = {
      ...initialState,
      threads: [mockThread],
      currentThread: mockThreadDetail,
    };

    test('should handle optimistic thread voting - switching from neutral to up', () => {
      const action = optimisticVoteThread({
        threadId: 'thread-1',
        voteType: 'up',
        userId,
      });
      const state = threadsReducer(stateWithThreads, action);

      const updatedThread = state.threads.find((t) => t.id === 'thread-1');
      expect(updatedThread?.upVotesBy).toContain(userId);
      expect(updatedThread?.downVotesBy).not.toContain(userId);

      expect(state.currentThread?.upVotesBy).toContain(userId);
      expect(state.currentThread?.downVotesBy).not.toContain(userId);
    });

    test('should handle optimistic thread voting - switching from up to down', () => {
      const stateWithUpvote: ThreadsState = {
        ...stateWithThreads,
        threads: [{
          ...mockThread,
          upVotesBy: [userId, 'user-2'],
          downVotesBy: [],
        }],
        currentThread: {
          ...mockThreadDetail,
          upVotesBy: [userId, 'user-2'],
          downVotesBy: [],
        },
      };

      const action = optimisticVoteThread({
        threadId: 'thread-1',
        voteType: 'down',
        userId,
      });
      const state = threadsReducer(stateWithUpvote, action);

      const updatedThread = state.threads.find((t) => t.id === 'thread-1');
      expect(updatedThread?.upVotesBy).not.toContain(userId);
      expect(updatedThread?.upVotesBy).toContain('user-2');
      expect(updatedThread?.downVotesBy).toContain(userId);

      expect(state.currentThread?.upVotesBy).not.toContain(userId);
      expect(state.currentThread?.downVotesBy).toContain(userId);
    });

    test('should handle optimistic comment voting', () => {
      const action = optimisticVoteComment({
        commentId: 'comment-1',
        voteType: 'up',
        userId,
      });
      const state = threadsReducer(stateWithThreads, action);

      const comment = state.currentThread?.comments.find((c) => c.id === 'comment-1');
      expect(comment?.upVotesBy).toContain(userId);
      expect(comment?.downVotesBy).not.toContain(userId);
    });

    test('should handle rollback thread vote', () => {
      const stateWithVote: ThreadsState = {
        ...stateWithThreads,
        threads: [{
          ...mockThread,
          upVotesBy: [userId],
          downVotesBy: [],
        }],
        currentThread: {
          ...mockThreadDetail,
          upVotesBy: [userId],
          downVotesBy: [],
        },
      };

      const action = rollbackVoteThread({
        threadId: 'thread-1',
        previousUpVotes: ['user-2'],
        previousDownVotes: ['user-3'],
      });
      const state = threadsReducer(stateWithVote, action);

      const updatedThread = state.threads.find((t) => t.id === 'thread-1');
      expect(updatedThread?.upVotesBy).toEqual(['user-2']);
      expect(updatedThread?.downVotesBy).toEqual(['user-3']);

      expect(state.currentThread?.upVotesBy).toEqual(['user-2']);
      expect(state.currentThread?.downVotesBy).toEqual(['user-3']);
    });
  });

  describe('createThread with category management', () => {
    test('should handle createThread fulfilled with new category', () => {
      const stateWithCategories: ThreadsState = {
        ...initialState,
        categories: ['general', 'tech'],
        threads: [mockThread],
      };

      const newThread: Thread = {
        ...mockThread,
        id: 'thread-new',
        category: 'newCategory',
      };

      const action = {
        type: createThread.fulfilled.type,
        payload: newThread,
      };
      const state = threadsReducer(stateWithCategories, action);

      expect(state.isCreating).toBe(false);
      expect(state.threads[0]).toEqual(newThread); // inserted at beginning
      expect(state.threads).toHaveLength(2);
      expect(state.categories).toContain('newCategory');
      expect(state.categories).toHaveLength(3);
    });

    test('should handle createThread fulfilled with existing category', () => {
      const stateWithCategories: ThreadsState = {
        ...initialState,
        categories: ['general', 'tech'],
        threads: [],
      };

      const newThread: Thread = {
        ...mockThread,
        id: 'thread-new',
        category: 'general', // existing category
      };

      const action = {
        type: createThread.fulfilled.type,
        payload: newThread,
      };
      const state = threadsReducer(stateWithCategories, action);

      expect(state.categories).toHaveLength(2); // no new category added
      expect(state.categories).toEqual(['general', 'tech']);
    });
  });

  describe('complex state interactions', () => {
    test('should handle createComment fulfilled updating currentThread', () => {
      const stateWithCurrentThread: ThreadsState = {
        ...initialState,
        currentThread: mockThreadDetail,
      };

      const action = {
        type: createComment.fulfilled.type,
        payload: mockComment,
      };
      const state = threadsReducer(stateWithCurrentThread, action);

      expect(state.isCreating).toBe(false);
      expect(state.currentThread?.comments).toHaveLength(2);
      expect(state.currentThread?.comments[1]).toEqual(mockComment);
    });

    test('should handle multiple synchronous actions', () => {
      let state = threadsReducer(initialState, setSelectedCategory('tech'));
      expect(state.selectedCategory).toBe('tech');

      state = threadsReducer(state, clearError());
      expect(state.error).toBe(null);

      state = threadsReducer(state, clearCurrentThread());
      expect(state.currentThread).toBe(null);
      expect(state.selectedCategory).toBe('tech'); // should persist
    });

    test('should handle fetchThreadDetail when currentThread already exists', () => {
      const stateWithCurrentThread: ThreadsState = {
        ...initialState,
        currentThread: mockThreadDetail,
      };

      const newThreadDetail: ThreadDetail = {
        ...mockThreadDetail,
        id: 'thread-2',
        title: 'New Thread Detail',
      };

      const action = {
        type: fetchThreadDetail.fulfilled.type,
        payload: newThreadDetail,
      };
      const state = threadsReducer(stateWithCurrentThread, action);

      expect(state.currentThread).toEqual(newThreadDetail);
      expect(state.isLoading).toBe(false);
    });
  });
});
