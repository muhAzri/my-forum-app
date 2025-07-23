import { Calendar, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { fetchThreadDetail } from '../../../core/store/slices/threadsSlice';
import { SafeHtml } from '../../../shared/components/ui/safe-html';
import { ThreadDetailSkeleton } from '../../../shared/components/ui/skeleton';
import { formatTimeAgo, capitalizeCategory } from '../../../shared/utils/utils';

import { CommentList } from './CommentList';
import { CreateCommentForm } from './CreateCommentForm';
import { VoteButtons } from './VoteButtons';

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

  const voteScore = currentThread.upVotesBy.length - currentThread.downVotesBy.length;
  const userVote = user ? (
    currentThread.upVotesBy.includes(user.id) ? 'up' :
      currentThread.downVotesBy.includes(user.id) ? 'down' : null
  ) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-card rounded-lg shadow-sm border border-border p-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
            {capitalizeCategory(currentThread.category)}
          </span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatTimeAgo(currentThread.createdAt)}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-card-foreground mb-6">
          {currentThread.title}
        </h1>

        <div className="flex items-center space-x-3 mb-6">
          {currentThread.owner.avatar ? (
            <img
              alt={currentThread.owner.name}
              className="w-10 h-10 rounded-full"
              src={currentThread.owner.avatar}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium text-card-foreground">{currentThread.owner.name}</p>
            <p className="text-sm text-muted-foreground">Thread Author</p>
          </div>
        </div>

        <div className="mb-8">
          <SafeHtml
            className="text-card-foreground"
            html={currentThread.body}
          />
        </div>

        <div className="flex items-center justify-between py-4 border-t border-border">
          <VoteButtons
            currentVote={userVote}
            itemId={currentThread.id}
            itemType="thread"
            voteCount={voteScore}
          />

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Join the conversation!
            </h3>
            <p className="text-gray-600 mb-4">
              Share your thoughts and engage with the community by adding a comment.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                to="/login"
              >
                Login to Comment
              </Link>
              <span className="text-gray-500">or</span>
              <Link
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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