import { Calendar, MessageCircle, ThumbsDown, ThumbsUp, User } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { formatTimeAgo } from '../../lib/utils';
import type { AppDispatch, RootState } from '../../store';
import { fetchThreadDetail } from '../../store/slices/threadsSlice';
import { SafeHtml } from '../ui/safe-html';
import { ThreadDetailSkeleton } from '../ui/skeleton';

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
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentThread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Thread not found.</p>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {currentThread.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatTimeAgo(currentThread.createdAt)}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
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
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{currentThread.owner.name}</p>
            <p className="text-sm text-gray-500">Thread Author</p>
          </div>
        </div>

        <div className="mb-8">
          <SafeHtml
            className="text-gray-700"
            html={currentThread.body}
          />
        </div>

        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <VoteButtons
            currentVote={userVote}
            itemId={currentThread.id}
            itemType="thread"
            voteCount={voteScore}
          />

          <div className="flex items-center space-x-4 text-sm text-gray-500">
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

        {user && (
          <div className="mb-8">
            <CreateCommentForm threadId={currentThread.id} />
          </div>
        )}

        <CommentList comments={currentThread.comments} threadId={currentThread.id} />
      </div>
    </div>
  );
}