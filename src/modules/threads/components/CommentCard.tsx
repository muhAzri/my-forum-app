import { Calendar, User } from 'lucide-react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../core/store';
import { SafeHtml } from '../../../shared/components/ui/safe-html';
import type { Comment } from '../../../shared/types/forum';
import { formatTimeAgo } from '../../../shared/utils/utils';

import { VoteButtons } from '../../voting/components/VoteButtons';

interface CommentCardProps {
  comment: Comment;
  threadId: string;
}

export function CommentCard({ comment, threadId }: CommentCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);


  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        {comment.owner.avatar ? (
          <img
            alt={comment.owner.name}
            className="w-8 h-8 rounded-full"
            src={comment.owner.avatar}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{comment.owner.name}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            {formatTimeAgo(comment.createdAt)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <SafeHtml
          className="text-gray-700"
          html={comment.content}
        />
      </div>

      <div className="flex items-center justify-between">
        <VoteButtons
          itemId={comment.id}
          itemType="comment"
          threadId={threadId}
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
        />

      </div>
    </div>
  );
}