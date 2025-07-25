import { Calendar, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { fetchThreadDetail } from '../../../core/store/slices/threadsSlice';
import { SafeHtml } from '../../../shared/components/ui/safe-html';
import { ThreadDetailSkeleton } from '../../../shared/components/ui/skeleton';
import { formatTimeAgo, capitalizeCategory } from '../../../shared/utils/utils';

import { VoteButtons } from '../../voting/components/VoteButtons';
import { CommentList } from './CommentList';
import { CreateCommentForm } from './CreateCommentForm';

export function ThreadDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentThread, isLoading, error } = useSelector((state: RootState) => state.threads);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchThreadDetail(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <ThreadDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentThread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Thread not found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground w-fit">
            {capitalizeCategory(currentThread.category)}
          </span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatTimeAgo(currentThread.createdAt)}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-4 sm:mb-6 leading-tight">
          {currentThread.title}
        </h1>

        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          {currentThread.owner.avatar ? (
            <img
              alt={currentThread.owner.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
              src={currentThread.owner.avatar}
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-card-foreground truncate">{currentThread.owner.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Thread Author</p>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <SafeHtml
            className="text-card-foreground prose prose-sm sm:prose max-w-none"
            html={currentThread.body}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 py-4 border-t border-border">
          <VoteButtons
            itemId={currentThread.id}
            itemType="thread"
            upVotesBy={currentThread.upVotesBy}
            downVotesBy={currentThread.downVotesBy}
          />

          <div className="flex items-center justify-center sm:justify-end space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{currentThread.upVotesBy.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{currentThread.downVotesBy.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{currentThread.comments.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({currentThread.comments.length})
        </h2>

        {user ? (
          <div className="mb-8">
            <CreateCommentForm threadId={currentThread.id} />
          </div>
        ) : (
          <div className="mb-8 p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Join the conversation!
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Share your thoughts and engage with the community by adding a comment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                to="/login"
              >
                Login to Comment
              </Link>
              <span className="text-gray-500 hidden sm:block">or</span>
              <Link
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                to="/register"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        <CommentList comments={currentThread.comments} threadId={currentThread.id} />
      </div>
    </div>
  );
}