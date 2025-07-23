import { useState, useCallback, useMemo } from 'react';
import { container } from '../../../infrastructure/di/Container';
import { useAuthContext } from '../../auth/components/AuthProvider';
import { IVotingService, VoteType, VoteState } from '../types/VotingTypes';

export function useVoting() {
  const [isVoting, setIsVoting] = useState(false);
  const { user, isAuthenticated } = useAuthContext();
  
  const votingService = container.resolve<IVotingService>('VotingService');

  const getVoteState = useCallback((
    itemId: string, 
    upVotesBy: string[], 
    downVotesBy: string[], 
    userId?: string
  ): VoteState => {
    const currentUserId = userId || user?.id;
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

  const voteOnThread = useCallback(async (threadId: string, voteType: VoteType) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to vote');
    }

    try {
      setIsVoting(true);
      await votingService.voteOnThread(threadId, voteType);
    } finally {
      setIsVoting(false);
    }
  }, [votingService, isAuthenticated]);

  const voteOnComment = useCallback(async (threadId: string, commentId: string, voteType: VoteType) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to vote');
    }

    try {
      setIsVoting(true);
      await votingService.voteOnComment(threadId, commentId, voteType);
    } finally {
      setIsVoting(false);
    }
  }, [votingService, isAuthenticated]);

  const toggleVote = useCallback((currentVote: VoteType | null, clickedVoteType: VoteType): VoteType => {
    // If user clicks the same vote type they already have, make it neutral
    if (currentVote === clickedVoteType) {
      return 'neutral';
    }
    // Otherwise, set to the clicked vote type
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