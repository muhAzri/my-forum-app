
import type { Comment } from '../../types/forum';

import { CommentCard } from './CommentCard';

interface CommentListProps {
  comments: Comment[];
  threadId: string;
}

export function CommentList({ comments, threadId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          threadId={threadId}
        />
      ))}
    </div>
  );
}