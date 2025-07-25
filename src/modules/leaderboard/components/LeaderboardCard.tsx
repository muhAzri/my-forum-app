import RankIndicator from '../../../shared/components/molecules/RankIndicator';
import ScoreDisplay from '../../../shared/components/molecules/ScoreDisplay';
import UserProfile from '../../../shared/components/molecules/UserProfile';
import type { LeaderboardEntry } from '../../../shared/types/forum';
import { cn } from '../../../shared/utils/utils';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
}

function LeaderboardCard({ entry, rank }: LeaderboardCardProps) {
  const getRankBg = () => {
    if (rank === 1) { return 'bg-yellow-50 border-yellow-200'; }
    if (rank === 2) { return 'bg-gray-50 border-gray-200'; }
    if (rank === 3) { return 'bg-amber-50 border-amber-200'; }
    return 'bg-white border-gray-200';
  };

  return (
    <div className={cn(
      'p-6 rounded-lg border hover:shadow-md transition-shadow',
      getRankBg(),
    )}
    >
      <div className="flex items-center space-x-4">
        <RankIndicator rank={rank} />

        <UserProfile
          avatarSize="lg"
          avatarUrl={entry.user.avatar}
          className="flex-1"
          email={entry.user.email}
          name={entry.user.name}
          truncate
        />

        <ScoreDisplay score={entry.score} />
      </div>
    </div>
  );
}

export default LeaderboardCard;
