import React from 'react';

import { cn } from '../../utils/utils';

export interface AvatarProps {
  src?: string | undefined;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string | undefined;
}

function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className,
}: AvatarProps) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img
          alt={alt ?? 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          src={src}
        />
      ) : (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center bg-primary-100 text-primary-600 font-medium',
            textSizeClasses[size],
          )}
        >
          {fallback ?? '?'}
        </div>
      )}
    </div>
  );
}

export default Avatar;