import { MessageCircle, ThumbsUp, ThumbsDown, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

import { createExcerpt } from '../../lib/sanitize';
import { formatTimeAgo } from '../../lib/utils';
import type { Thread } from '../../types/forum';

interface ThreadCardProps {
  thread: Thread;
  author?: { name: string; avatar?: string };
}

export function ThreadCard({ thread, author }: ThreadCardProps) {
  const voteScore = thread.upVotesBy.length - thread.downVotesBy.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {thread.category}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {formatTimeAgo(thread.createdAt)}
            </div>
          </div>

          <Link
            className="block group"
            to={`/threads/${thread.id}`}
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {thread.title}
            </h3>
            {thread.body && (
              <p className="mt-2 text-gray-600 line-clamp-3">
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
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-500" />
                </div>
              )}
              <span className="text-sm text-gray-600">{author?.name ?? 'Unknown User'}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
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
          <div className={`text-lg font-semibold ${voteScore > 0 ? 'text-green-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {voteScore > 0 ? '+' : ''}{voteScore}
          </div>
          <div className="text-xs text-gray-500">votes</div>
        </div>
      </div>
    </div>
  );
}