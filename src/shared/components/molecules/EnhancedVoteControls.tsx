import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../../core/store';
import {
  voteThread,
  voteComment,
  optimisticVoteThread,
  optimisticVoteComment,
  rollbackVoteThread,
  rollbackVoteComment,
} from '../../../core/store/slices/threadsSlice';
import Link from '../atoms/Link';
import Text from '../atoms/Text';

import VoteControls from './VoteControls';

interface EnhancedVoteControlsProps {
  itemType: 'thread' | 'comment';
  itemId: string;
  commentId?: string | undefined;
  upVotes: number;
  downVotes: number;
  currentVote: 'up' | 'down' | null;
  upVotesBy: string[];
  downVotesBy: string[];
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
  className?: string;
}

function EnhancedVoteControls({
  itemType,
  itemId,
  commentId,
  upVotes,
  downVotes,
  currentVote,
  upVotesBy,
  downVotesBy,
  orientation = 'horizontal',
  size = 'md',
  className,
}: EnhancedVoteControlsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) { return; }

    const finalVoteType = currentVote === voteType ? 'neutral' : voteType;
    const userId = user.id;

    const previousUpVotes = [...upVotesBy];
    const previousDownVotes = [...downVotesBy];

    if (itemType === 'thread') {
      dispatch(optimisticVoteThread({
        threadId: itemId,
        voteType: finalVoteType,
        userId,
      }));

      try {
        await dispatch(voteThread({
          threadId: itemId,
          voteType: finalVoteType,
        })).unwrap();
      } catch {
        dispatch(rollbackVoteThread({
          threadId: itemId,
          previousUpVotes,
          previousDownVotes,
        }));
      }
    } else if (commentId) {
      dispatch(optimisticVoteComment({
        commentId,
        voteType: finalVoteType,
        userId,
      }));

      try {
        await dispatch(voteComment({
          threadId: itemId,
          commentId,
          voteType: finalVoteType,
        })).unwrap();
      } catch {
        dispatch(rollbackVoteComment({
          commentId,
          previousUpVotes,
          previousDownVotes,
        }));
      }
    }
  };

  const handleUpVote = () => handleVote('up');
  const handleDownVote = () => handleVote('down');

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <VoteControls
          className={className}
          disabled
          downVotes={downVotes}
          onDownVote={() => {}}
          onUpVote={() => {}}
          orientation={orientation}
          size={size}
          upVotes={upVotes}
          userVote={null}
        />
        <Text className="text-muted-foreground" variant="caption">
          <Link className="underline" to="/login">
            Login
          </Link>
          {' or '}
          <Link className="underline" to="/register">
            Register
          </Link>
          {' to vote'}
        </Text>
      </div>
    );
  }

  let userVote: 1 | -1 | null = null;
  if (currentVote === 'up') {
    userVote = 1;
  } else if (currentVote === 'down') {
    userVote = -1;
  }

  return (
    <VoteControls
      className={className}
      disabled={false}
      downVotes={downVotes}
      onDownVote={handleDownVote}
      onUpVote={handleUpVote}
      orientation={orientation}
      size={size}
      upVotes={upVotes}
      userVote={userVote}
    />
  );
}

export default EnhancedVoteControls;
