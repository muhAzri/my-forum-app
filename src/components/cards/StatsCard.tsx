import { BaseCard } from '@/components/base/BaseCard';
import type { IDataCard } from '@/components/interfaces/ICard';
import type { StatsData } from '@/types/CardTypes';

interface StatsCardData extends IDataCard {
  stats: StatsData[]
}

interface StatsCardProps {
  data: StatsCardData
}

export function StatsCard({ data }: StatsCardProps) {
  const { title, description, stats } = data;

  return (
    <BaseCard description={description} title={title}>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span>{stat.label}:</span>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </BaseCard>
  );
}