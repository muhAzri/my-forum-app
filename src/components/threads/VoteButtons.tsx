import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../store';
import { voteThread, voteComment } from '../../store/slices/threadsSlice';
import { Button } from '../ui/button';

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

    try {
      if (itemType === 'thread') {
        await dispatch(voteThread({
          threadId: itemId,
          voteType: finalVoteType,
        })).unwrap();
      } else if (commentId) {
        await dispatch(voteComment({
          threadId: itemId,
          commentId,
          voteType: finalVoteType,
        })).unwrap();
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => {
              // Could show a tooltip or navigate to login
            }}
            size="sm"
            title="Login to vote"
            variant="ghost"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          
          <span className={`text-sm font-medium ${
            voteCount > 0 ? 'text-green-600' :
              voteCount < 0 ? 'text-red-600' : 'text-gray-600'
          }`}
          >
            {voteCount > 0 ? `+${voteCount}` : voteCount}
          </span>

          <Button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => {
              // Could show a tooltip or navigate to login
            }}
            size="sm"
            title="Login to vote"
            variant="ghost"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          <Link className="text-blue-600 hover:text-blue-700 underline" to="/login">
            Login
          </Link>
          {' or '}
          <Link className="text-blue-600 hover:text-blue-700 underline" to="/register">
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
        className={currentVote === 'up' ? 'text-green-600' : 'text-gray-500'}
        onClick={() => handleVote('up')}
        size="sm"
        variant="ghost"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>

      <span className={`text-sm font-medium ${
        voteCount > 0 ? 'text-green-600' :
          voteCount < 0 ? 'text-red-600' : 'text-gray-600'
      }`}
      >
        {voteCount > 0 ? `+${voteCount}` : voteCount}
      </span>

      <Button
        className={currentVote === 'down' ? 'text-red-600' : 'text-gray-500'}
        onClick={() => handleVote('down')}
        size="sm"
        variant="ghost"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  );
}