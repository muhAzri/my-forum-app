import { cn } from '../../utils/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-gray-200',
        className,
      )}
    />
  );
}

export function ThreadCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-7 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-center">
          <Skeleton className="h-6 w-8 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function CommentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      <div className="mb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-6" />
        </div>
      </div>
    </div>
  );
}

export function ThreadDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-10 w-3/4 mb-6" />

        <div className="flex items-center space-x-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="mb-8">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <CommentCardSkeleton />
          <CommentCardSkeleton />
          <CommentCardSkeleton />
        </div>
      </div>
    </div>
  );
}
