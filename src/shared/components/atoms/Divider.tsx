import React from 'react';

import { cn } from '../../utils/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ orientation = 'horizontal', className }) => (
  <div
    aria-orientation={orientation}
    className={cn(
      'bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className,
    )}
    role="separator"
  />
);

export default Divider;