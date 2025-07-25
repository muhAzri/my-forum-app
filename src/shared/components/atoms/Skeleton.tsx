import { cn } from '../../utils/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-label="Loading"
      className={cn(
        'animate-shimmer rounded-md bg-gray-200',
        className,
      )}
      role="status"
    />
  );
}

export default Skeleton;
