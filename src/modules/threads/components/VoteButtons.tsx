import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { voteThread, voteComment } from '../../../core/store/slices/threadsSlice';
import { Button } from '../../../shared/components/ui/button';

interface VoteButtonsProps {
  itemType: 'thread' | 'comment';
  itemId: string;
  commentId?: string;
  voteCount: number;
  currentVote: 'up' | 'down' | null;
}

export function VoteButtons({
  itemType,
  itemId,
  commentId,
  voteCount,
  currentVote,
}: VoteButtonsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) { return; }

    const finalVoteType = currentVote === voteType ? 'neutral' : voteType;

    if (itemType === 'thread') {
      dispatch(voteThread({
        threadId: itemId,
        voteType: finalVoteType,
      }));
    } else if (commentId) {
      dispatch(voteComment({
        threadId: itemId,
        commentId,
        voteType: finalVoteType,
      }));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
            }}
            size="sm"
            title="Login to vote"
            variant="ghost"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>

          <span className={`text-sm font-medium ${
            voteCount > 0 ? 'text-success' :
              voteCount < 0 ? 'text-error' : 'text-foreground'
          }`}
          >
            {voteCount > 0 ? `+${voteCount}` : voteCount}
          </span>

          <Button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
            }}
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
        className={currentVote === 'up' ? 'text-success hover:text-success' : 'text-muted-foreground hover:text-foreground'}
        onClick={() => handleVote('up')}
        size="sm"
        variant="ghost"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>

      <span className={`text-sm font-medium ${
        voteCount > 0 ? 'text-success' :
          voteCount < 0 ? 'text-error' : 'text-foreground'
      }`}
      >
        {voteCount > 0 ? `+${voteCount}` : voteCount}
      </span>

      <Button
        className={currentVote === 'down' ? 'text-error hover:text-error' : 'text-muted-foreground hover:text-foreground'}
        onClick={() => handleVote('down')}
        size="sm"
        variant="ghost"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
}