import { Trophy, User } from 'lucide-react';

import type { LeaderboardEntry } from '../../types/forum';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
}

export function LeaderboardCard({ entry, rank }: LeaderboardCardProps) {
  const getRankIcon = () => {
    if (rank === 1) {
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    } else if (rank === 2) {
      return <Trophy className="w-6 h-6 text-gray-400" />;
    } else if (rank === 3) {
      return <Trophy className="w-6 h-6 text-amber-600" />;
    }
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getRankBg = () => {
    if (rank === 1) { return 'bg-yellow-50 border-yellow-200'; }
    if (rank === 2) { return 'bg-gray-50 border-gray-200'; }
    if (rank === 3) { return 'bg-amber-50 border-amber-200'; }
    return 'bg-white border-gray-200';
  };

  return (
    <div className={`p-6 rounded-lg border ${getRankBg()} hover:shadow-md transition-shadow`}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center">
          {getRankIcon()}
        </div>

        <div className="flex-shrink-0">
          {entry.user.avatar ? (
            <img
              alt={entry.user.name}
              className="w-12 h-12 rounded-full"
              src={entry.user.avatar}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {entry.user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {entry.user.email}
          </p>
        </div>

        <div className="flex-shrink-0 text-right">
          <div className="text-2xl font-bold text-primary-600">
            {entry.score}
          </div>
          <div className="text-sm text-gray-500">
            points
          </div>
        </div>
      </div>
    </div>
  );
}