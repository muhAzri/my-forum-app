import { Trophy } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils/utils';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface RankIndicatorProps {
  rank: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function RankIndicator({ rank, size = 'md', className }: RankIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const getRankIcon = () => {
    if (rank === 1) {
      return <Icon className={cn(sizeClasses[size], 'text-yellow-500')} icon={Trophy} />;
    } else if (rank === 2) {
      return <Icon className={cn(sizeClasses[size], 'text-gray-400')} icon={Trophy} />;
    } else if (rank === 3) {
      return <Icon className={cn(sizeClasses[size], 'text-amber-600')} icon={Trophy} />;
    }
    return (
      <Text className={cn(textSizes[size], 'text-gray-600')} variant="body" weight="bold">
        #{rank}
      </Text>
    );
  };

  return (
    <div className={cn('flex-shrink-0 flex items-center justify-center', className)}>
      {getRankIcon()}
    </div>
  );
}

export default RankIndicator;