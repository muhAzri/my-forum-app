import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/components/Button';
import { useVoting } from '../hooks/useVoting';
import { useAuthContext } from '../../auth/components/AuthProvider';
import { VotingProps } from '../types/VotingTypes';

export function VoteButtons({
  itemType,
  itemId,
  threadId,
  upVotesBy,
  downVotesBy,
  onVoteSuccess,
}: VotingProps) {
  const { user, isAuthenticated } = useAuthContext();
  const { getVoteState, voteOnThread, voteOnComment, toggleVote, isVoting, canVote } = useVoting();

  const voteState = getVoteState(itemId, upVotesBy, downVotesBy, user?.id);

  const handleVote = async (clickedVoteType: 'up' | 'down') => {
    if (!canVote) return;

    try {
      const finalVoteType = toggleVote(voteState.currentVote, clickedVoteType);

      if (itemType === 'thread') {
        await voteOnThread(itemId, finalVoteType);
      } else if (itemType === 'comment' && threadId) {
        await voteOnComment(threadId, itemId, finalVoteType);
      }

      onVoteSuccess?.();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className=\"flex items-center space-x-2\">
        <div className=\"flex items-center space-x-2\">
          <Button
            className=\"text-muted-foreground hover:text-foreground\"
            disabled
            size=\"sm\"
            title=\"Login to vote\"
            variant=\"ghost\"
          >
            <ThumbsUp className=\"w-4 h-4\" />
          </Button>
          
          <span className={`text-sm font-medium ${
            voteState.score > 0 ? 'text-success' :
              voteState.score < 0 ? 'text-error' : 'text-foreground'
          }`}>
            {voteState.score > 0 ? `+${voteState.score}` : voteState.score}
          </span>

          <Button
            className=\"text-muted-foreground hover:text-foreground\"
            disabled
            size=\"sm\"
            title=\"Login to vote\"
            variant=\"ghost\"
          >
            <ThumbsDown className=\"w-4 h-4\" />
          </Button>
        </div>
        
        <div className=\"text-xs text-muted-foreground\">
          <Link className=\"text-primary hover:text-primary underline\" to=\"/login\">
            Login
          </Link>
          {' or '}
          <Link className=\"text-primary hover:text-primary underline\" to=\"/register\">
            Register
          </Link>
          {' to vote'}
        </div>
      </div>
    );
  }

  return (
    <div className=\"flex items-center space-x-2\">
      <Button
        className={voteState.currentVote === 'up' ? 'text-success hover:text-success' : 'text-muted-foreground hover:text-foreground'}
        disabled={isVoting}
        onClick={() => handleVote('up')}
        size=\"sm\"
        variant=\"ghost\"
      >
        <ThumbsUp className=\"w-4 h-4\" />
      </Button>

      <span className={`text-sm font-medium ${
        voteState.score > 0 ? 'text-success' :
          voteState.score < 0 ? 'text-error' : 'text-foreground'
      }`}>
        {voteState.score > 0 ? `+${voteState.score}` : voteState.score}
      </span>

      <Button
        className={voteState.currentVote === 'down' ? 'text-error hover:text-error' : 'text-muted-foreground hover:text-foreground'}
        disabled={isVoting}
        onClick={() => handleVote('down')}
        size=\"sm\"
        variant=\"ghost\"
      >
        <ThumbsDown className=\"w-4 h-4\" />
      </Button>
    </div>
  );
}