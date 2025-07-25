import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { container } from '../../../core/Container';
import type { RootState } from '../../../core/store';
import {
  optimisticVoteThread, optimisticVoteComment, rollbackVoteThread, rollbackVoteComment,
} from '../../../core/store/slices/threadsSlice';
import type { IVotingService, VoteType, VoteState } from '../types/VotingTypes';

export function useVoting() {
  const [isVoting, setIsVoting] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const dispatch = useDispatch();

  const votingService = container.resolve<IVotingService>('VotingService');

  const getVoteState = useCallback((
    _itemId: string,
    upVotesBy: string[],
    downVotesBy: string[],
    userId?: string,
  ): VoteState => {
    const currentUserId = userId ?? user?.id;
    const upVotes = upVotesBy.length;
    const downVotes = downVotesBy.length;
    const score = upVotes - downVotes;

    let currentVote: VoteType | null = null;
    let userHasVoted = false;

    if (currentUserId) {
      if (upVotesBy.includes(currentUserId)) {
        currentVote = 'up';
        userHasVoted = true;
      } else if (downVotesBy.includes(currentUserId)) {
        currentVote = 'down';
        userHasVoted = true;
      }
    }

    return {
      currentVote,
      upVotes,
      downVotes,
      score,
      userHasVoted,
    };
  }, [user?.id]);

  const voteOnThread = useCallback(async (
    threadId: string,
    voteType: VoteType,
    currentUpVotes: string[],
    currentDownVotes: string[],
  ) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('You must be logged in to vote');
    }

    const previousUpVotes = [...currentUpVotes];
    const previousDownVotes = [...currentDownVotes];

    dispatch(optimisticVoteThread({ threadId, voteType, userId: user.id }));

    try {
      setIsVoting(true);
      await votingService.voteOnThread(threadId, voteType);
    } catch (error) {
      dispatch(rollbackVoteThread({ threadId, previousUpVotes, previousDownVotes }));
      throw error;
    } finally {
      setIsVoting(false);
    }
  }, [votingService, isAuthenticated, user?.id, dispatch]);

  const voteOnComment = useCallback(async (
    threadId: string,
    commentId: string,
    voteType: VoteType,
    currentUpVotes: string[],
    currentDownVotes: string[],
  ) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('You must be logged in to vote');
    }

    const previousUpVotes = [...currentUpVotes];
    const previousDownVotes = [...currentDownVotes];

    dispatch(optimisticVoteComment({ commentId, voteType, userId: user.id }));

    try {
      setIsVoting(true);
      await votingService.voteOnComment(threadId, commentId, voteType);
    } catch (error) {
      dispatch(rollbackVoteComment({ commentId, previousUpVotes, previousDownVotes }));
      throw error;
    } finally {
      setIsVoting(false);
    }
  }, [votingService, isAuthenticated, user?.id, dispatch]);

  const toggleVote = useCallback((
    currentVote: VoteType | null,
    clickedVoteType: VoteType,
  ): VoteType => {
    if (currentVote === clickedVoteType) {
      return 'neutral';
    }
    return clickedVoteType;
  }, []);

  return {
    isVoting,
    getVoteState,
    voteOnThread,
    voteOnComment,
    toggleVote,
    canVote: isAuthenticated,
  };
}
