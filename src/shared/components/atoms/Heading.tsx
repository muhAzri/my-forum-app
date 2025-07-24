import React from 'react';

import { cn } from '../../utils/utils';

export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  weight = 'bold',
  className,
}) => {
  const Component = `h${level}` as React.ElementType;

  const levelClasses = {
    1: 'text-4xl lg:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg lg:text-xl',
    6: 'text-base lg:text-lg',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <Component
      className={cn(
        'text-foreground leading-tight tracking-tight',
        levelClasses[level],
        weightClasses[weight],
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default Heading;