import React from 'react';

import { cn } from '../../utils/utils';
import Text from '../atoms/Text';

interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function ScoreDisplay({
  score,
  label = 'points',
  size = 'md',
  className,
}: ScoreDisplayProps) {
  const scoreTextSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const labelTextVariants = {
    sm: 'caption',
    md: 'small',
    lg: 'body',
  } as const;

  return (
    <div className={cn('flex-shrink-0 text-right', className)}>
      <Text
        className={cn(scoreTextSizes[size], 'text-primary-600')}
        variant="body"
        weight="bold"
      >
        {score}
      </Text>
      <Text className="text-gray-500" variant={labelTextVariants[size]}>
        {label}
      </Text>
    </div>
  );
}

export default ScoreDisplay;