import { useState, useCallback } from 'react';

import { container } from '../../../core/Container';
import type {
  IThreadsService,
  CreateThreadData,
  CreateCommentData,
  ThreadsState,
} from '../types/ThreadTypes';

export function useThreads() {
  const [state, setState] = useState<ThreadsState>({
    threads: [],
    currentThread: null,
    categories: ['general', 'redux', 'react'],
    selectedCategory: null,
    isLoading: false,
    isVoting: false,
    isCreating: false,
    error: null,
  });

  const threadsService = container.resolve<IThreadsService>('ThreadsService');

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setVoting = useCallback((isVoting: boolean) => {
    setState((prev) => ({ ...prev, isVoting }));
  }, []);

  const setCreating = useCallback((isCreating: boolean) => {
    setState((prev) => ({ ...prev, isCreating }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const threads = await threadsService.getThreads();

      setState((prev) => ({
        ...prev,
        threads,
        isLoading: false,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch threads');
      setLoading(false);
    }
  }, [threadsService, setLoading, setError]);

  const fetchThreadDetail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const threadDetail = await threadsService.getThreadDetail(id);

      setState((prev) => ({
        ...prev,
        currentThread: threadDetail,
        isLoading: false,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch thread detail');
      setLoading(false);
    }
  }, [threadsService, setLoading, setError]);

  const createThread = useCallback(async (data: CreateThreadData) => {
    try {
      setCreating(true);
      setError(null);

      const newThread = await threadsService.createThread(data);

      setState((prev) => ({
        ...prev,
        threads: [newThread, ...prev.threads],
        isCreating: false,
      }));

      return { success: true, thread: newThread };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create thread';
      setError(errorMessage);
      setCreating(false);
      return { success: false, error: errorMessage };
    }
  }, [threadsService, setCreating, setError]);

  const createComment = useCallback(async (threadId: string, data: CreateCommentData) => {
    try {
      setCreating(true);
      setError(null);

      const newComment = await threadsService.createComment(threadId, data);

      setState((prev) => ({
        ...prev,
        currentThread: prev.currentThread?.id === threadId
          ? { ...prev.currentThread, comments: [...prev.currentThread.comments, newComment] }
          : prev.currentThread,
        isCreating: false,
      }));

      return { success: true, comment: newComment };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create comment';
      setError(errorMessage);
      setCreating(false);
      return { success: false, error: errorMessage };
    }
  }, [threadsService, setCreating, setError]);

  const voteThread = useCallback(async (threadId: string, voteType: 'up' | 'down' | 'neutral') => {
    try {
      setVoting(true);
      setError(null);

      await threadsService.voteThread(threadId, voteType);

      if (state.currentThread?.id === threadId) {
        await fetchThreadDetail(threadId);
      }
      await fetchThreads();

      setVoting(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to vote on thread');
      setVoting(false);
    }
  }, [
    threadsService,
    state.currentThread?.id,
    fetchThreadDetail,
    fetchThreads,
    setVoting,
    setError,
  ]);

  const voteComment = useCallback(async (threadId: string, commentId: string, voteType: 'up' | 'down' | 'neutral') => {
    try {
      setVoting(true);
      setError(null);

      await threadsService.voteComment(threadId, commentId, voteType);

      await fetchThreadDetail(threadId);

      setVoting(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to vote on comment');
      setVoting(false);
    }
  }, [threadsService, fetchThreadDetail, setVoting, setError]);

  const setSelectedCategory = useCallback((category: string | null) => {
    setState((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const filteredThreads = state.selectedCategory
    ? state.threads.filter((thread) => thread.category === state.selectedCategory)
    : state.threads;

  return {
    ...state,
    filteredThreads,
    fetchThreads,
    fetchThreadDetail,
    createThread,
    createComment,
    voteThread,
    voteComment,
    setSelectedCategory,
  };
}