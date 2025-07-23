import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../../core/store';
import { fetchLeaderboards } from '../../../core/store/slices/leaderboardSlice';
import { Button } from '../../../shared/components/ui/button';
import { LoadingCard } from '../../../shared/components/ui/pulse-loader';
import { Skeleton } from '../../../shared/components/ui/skeleton';

import { LeaderboardCard } from './LeaderboardCard';

export function LeaderboardList() {
  const dispatch = useDispatch<AppDispatch>();
  const { leaderboards, isLoading, error } = useSelector((state: RootState) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-48 mx-auto mb-2" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        <div className="space-y-4 mb-8">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`leaderboard-skeleton-${index}`} className="p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <LoadingCard
          description="Calculating community rankings and scores..."
          title="Loading Leaderboard"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchLeaderboards())}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-600">
          Top contributors in our forum community
        </p>
      </div>

      {leaderboards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No leaderboard data available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboards.map((entry, index) => (
            <LeaderboardCard
              key={entry.user.id}
              entry={entry}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}