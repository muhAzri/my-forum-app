import { MessageCircle, ThumbsUp, ThumbsDown, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Thread } from '../../../shared/types/forum';
import { createExcerpt } from '../../../shared/utils/sanitize';
import { formatTimeAgo, capitalizeCategory } from '../../../shared/utils/utils';

interface ThreadCardProps {
  thread: Thread;
  author?: { name: string; avatar?: string };
}

export function ThreadCard({ thread, author }: ThreadCardProps) {
  const voteScore = thread.upVotesBy.length - thread.downVotesBy.length;

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {capitalizeCategory(thread.category)}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {formatTimeAgo(thread.createdAt)}
            </div>
          </div>

          <Link
            className="block group"
            to={`/threads/${thread.id}`}
          >
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {thread.title}
            </h3>
            {thread.body && (
              <p className="mt-2 text-muted-foreground line-clamp-3">
                {createExcerpt(thread.body, 150)}
              </p>
            )}
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {author?.avatar ? (
                <img
                  alt={author.name}
                  className="w-6 h-6 rounded-full"
                  src={author.avatar}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm text-muted-foreground">{author?.name ?? 'Unknown User'}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{thread.upVotesBy.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsDown className="w-4 h-4" />
                <span>{thread.downVotesBy.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{thread.totalComments}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-center">
          <div
            className={`text-lg font-semibold ${(() => {
              if (voteScore > 0) {
                return 'text-success';
              }
              if (voteScore < 0) {
                return 'text-error';
              }
              return 'text-muted-foreground';
            })()}`}
          >
            {voteScore > 0 ? '+' : ''}{voteScore}
          </div>
          <div className="text-xs text-muted-foreground">votes</div>
        </div>
      </div>
    </div>
  );
}