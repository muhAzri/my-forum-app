import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { RootState } from '../../../core/store';
import { Button } from '../../../shared/components/ui/button';
import { useVoting } from '../hooks/useVoting';
import type { VotingProps } from '../types/VotingTypes';

export function VoteButtons({
  itemType,
  itemId,
  threadId,
  upVotesBy,
  downVotesBy,
  onVoteSuccess,
}: VotingProps) {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const { getVoteState, voteOnThread, voteOnComment, toggleVote, isVoting, canVote } = useVoting();

  const voteState = getVoteState(itemId, upVotesBy, downVotesBy, user?.id);

  const handleVote = async (clickedVoteType: 'up' | 'down') => {
    if (!canVote) {
      return;
    }

    const finalVoteType = toggleVote(voteState.currentVote, clickedVoteType);

    if (itemType === 'thread') {
      voteOnThread(itemId, finalVoteType, upVotesBy, downVotesBy).then(() => onVoteSuccess?.());
    } else if (itemType === 'comment' && threadId) {
      voteOnComment(threadId, itemId, finalVoteType, upVotesBy, downVotesBy).then(() => onVoteSuccess?.());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            className="text-muted-foreground hover:text-muted-foreground cursor-not-allowed opacity-50"
            disabled
            size="sm"
            title="Login to vote"
            variant="ghost"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>

          <span className={`text-sm font-medium ${(() => {
            if (voteState.score > 0) {
              return 'text-success';
            }
            if (voteState.score < 0) {
              return 'text-error';
            }
            return 'text-foreground';
          })()}`}
          >
            {voteState.score > 0 ? `+${voteState.score}` : voteState.score}
          </span>

          <Button
            className="text-muted-foreground hover:text-muted-foreground cursor-not-allowed opacity-50"
            disabled
            size="sm"
            title="Login to vote"
            variant="ghost"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <Link className="text-primary hover:text-primary underline" to="/login">
            Login
          </Link>
          {' or '}
          <Link className="text-primary hover:text-primary underline" to="/register">
            Register
          </Link>
          {' to vote'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        className={voteState.currentVote === 'up' 
          ? 'text-success hover:text-success hover:bg-success/10 transition-colors' 
          : 'text-muted-foreground hover:text-success hover:bg-success/10 transition-colors'}
        disabled={isVoting}
        onClick={() => handleVote('up')}
        size="sm"
        variant="ghost"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>

      <span className={`text-sm font-medium ${(() => {
        if (voteState.score > 0) {
          return 'text-success';
        }
        if (voteState.score < 0) {
          return 'text-error';
        }
        return 'text-foreground';
      })()}`}
      >
        {voteState.score > 0 ? `+${voteState.score}` : voteState.score}
      </span>

      <Button
        className={voteState.currentVote === 'down' 
          ? 'text-error hover:text-error hover:bg-destructive/10 transition-colors' 
          : 'text-muted-foreground hover:text-error hover:bg-destructive/10 transition-colors'}
        disabled={isVoting}
        onClick={() => handleVote('down')}
        size="sm"
        variant="ghost"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
}