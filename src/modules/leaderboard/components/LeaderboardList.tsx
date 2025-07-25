import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../../core/store';
import { fetchLeaderboards } from '../../../core/store/slices/leaderboardSlice';
import Button from '../../../shared/components/atoms/Button';
import Skeleton from '../../../shared/components/atoms/Skeleton';
import Text from '../../../shared/components/atoms/Text';
import AlertMessage from '../../../shared/components/molecules/AlertMessage';
import EmptyState from '../../../shared/components/molecules/EmptyState';
import PageHeader from '../../../shared/components/molecules/PageHeader';
import { LoadingCard } from '../../../shared/components/ui/pulse-loader';

import LeaderboardCard from './LeaderboardCard';

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AlertMessage
          className="text-center"
          variant="error"
        >
          <div className="space-y-4">
            <Text variant="body">{error}</Text>
            <Button onClick={() => dispatch(fetchLeaderboards())}>
              Retry
            </Button>
          </div>
        </AlertMessage>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        className="text-center justify-center"
        subtitle="Top contributors in our forum community"
        title="Leaderboard"
      />

      {leaderboards.length === 0 ? (
        <EmptyState
          message="There are no contributors to display yet. Start participating in the forum to see rankings!"
          title="No Leaderboard Data"
        />
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
