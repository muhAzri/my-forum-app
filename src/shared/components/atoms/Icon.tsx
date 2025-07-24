import type { LucideIcon } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils/utils';

export interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 'md', className }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <IconComponent
      className={cn(
        'text-current',
        sizeClasses[size],
        className,
      )}
    />
  );
};

export default Icon;