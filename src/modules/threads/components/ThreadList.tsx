import { Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../core/store';
import { fetchThreads, setSelectedCategory } from '../../../core/store/slices/threadsSlice';
import { fetchUsers } from '../../../core/store/slices/usersSlice';
import { Button } from '../../../shared/components/ui/button';
import { LoadingCard, TypingLoader } from '../../../shared/components/ui/pulse-loader';
import { ThreadCardSkeleton } from '../../../shared/components/ui/skeleton';

import { CategoryFilter } from './CategoryFilter';
import { ThreadCard } from './ThreadCard';

export function ThreadList() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    threads,
    categories,
    selectedCategory,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.threads);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredThreads = useMemo(() => {
    if (!selectedCategory) { return threads; }
    return threads.filter((thread) => thread.category === selectedCategory);
  }, [threads, selectedCategory]);

  const handleCategorySelect = (category: string | null) => {
    dispatch(setSelectedCategory(category));
  };

  if (isLoading && threads.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          {token && user && (
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <ThreadCardSkeleton key={`thread-skeleton-${index}`} />
          ))}
        </div>

        <div className="mt-8">
          <LoadingCard
            description="Fetching the latest discussions from our community..."
            title="Loading Forum Threads"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchThreads())}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Forum Discussions</h1>
        {token && user && (
          <Button asChild className="w-full sm:w-auto">
            <Link className="inline-flex items-center justify-center gap-2" to="/create-thread">
              <Plus className="w-4 h-4" />
              New Thread
            </Link>
          </Button>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {filteredThreads.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            {selectedCategory
              ? `No threads found in the "${selectedCategory}" category.`
              : 'No threads found.'}
          </p>
          {token && user && (
            <Button asChild className="w-full sm:w-auto">
              <Link className="inline-flex items-center justify-center" to="/create-thread">Create the first thread</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {isLoading && threads.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg">
                <TypingLoader text="Refreshing threads" />
              </div>
            </div>
          )}
          {filteredThreads.map((thread) => {
            const author = users.find((u) => u.id === thread.ownerId);
            return (
              <ThreadCard
                key={thread.id}
                thread={thread}
                {...(author && { author })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
