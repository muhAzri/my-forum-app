import React from 'react';

import { cn } from '../../utils/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    aria-label="Loading"
    className={cn(
      'animate-shimmer rounded-md bg-gray-200',
      className,
    )}
    role="status"
  />
);

export default Skeleton;