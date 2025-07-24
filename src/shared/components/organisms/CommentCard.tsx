import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../core/store';
import type { Comment } from '../../../shared/types/forum';
import { cn } from '../../utils/utils';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import CommentHeader from '../molecules/CommentHeader';
import { SafeHtml } from '../ui/safe-html';

interface CommentCardProps {
  comment: Comment;
  threadId: string;
  VoteButtons?: React.ComponentType<unknown>;
  className?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  threadId,
  VoteButtons,
  className,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const voteScore = comment.upVotesBy.length - comment.downVotesBy.length;
  const userVote = user ? (
    comment.upVotesBy.includes(user.id) ? 'up' :
      comment.downVotesBy.includes(user.id) ? 'down' : null
  ) : null;

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <CommentHeader
        avatarUrl={comment.owner.avatar}
        className="mb-4"
        createdAt={comment.createdAt}
        username={comment.owner.name}
      />

      <div className="mb-4">
        <SafeHtml
          className="text-gray-700"
          html={comment.content}
        />
      </div>

      <div className="flex items-center justify-between">
        {VoteButtons && (
          <VoteButtons
            commentId={comment.id}
            currentVote={userVote}
            itemId={threadId}
            itemType="comment"
            voteCount={voteScore}
          />
        )}

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon className="text-muted-foreground" icon={ThumbsUp} size="xs" />
            <Text className="text-muted-foreground" variant="small">
              {comment.upVotesBy.length}
            </Text>
          </div>
          <div className="flex items-center space-x-1">
            <Icon className="text-muted-foreground" icon={ThumbsDown} size="xs" />
            <Text className="text-muted-foreground" variant="small">
              {comment.downVotesBy.length}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;