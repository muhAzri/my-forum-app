import EnhancedVoteControls from '../../../shared/components/molecules/EnhancedVoteControls';

interface VoteButtonsProps {
  itemType: 'thread' | 'comment';
  itemId: string;
  commentId?: string;
  voteCount: number;
  currentVote: 'up' | 'down' | null;
  upVotes?: number;
  downVotes?: number;
  upVotesBy?: string[];
  downVotesBy?: string[];
}

export function VoteButtons({
  itemType,
  itemId,
  commentId,
  currentVote,
  upVotes = 0,
  downVotes = 0,
  upVotesBy = [],
  downVotesBy = [],
}: VoteButtonsProps) {
  const props = {
    itemType,
    itemId,
    upVotes,
    downVotes,
    currentVote,
    upVotesBy,
    downVotesBy,
    orientation: 'horizontal' as const,
    size: 'sm' as const,
    ...(commentId !== undefined && { commentId }),
  };

  return <EnhancedVoteControls {...props} />;
}