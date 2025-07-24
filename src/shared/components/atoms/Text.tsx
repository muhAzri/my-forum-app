import React from 'react';

import { cn } from '../../utils/utils';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'small' | 'muted' | 'caption';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  as?: React.ElementType;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  className,
  as: Component = 'p',
}) => {
  const variantClasses = {
    body: 'text-base text-foreground',
    small: 'text-sm text-foreground',
    muted: 'text-sm text-muted-foreground',
    caption: 'text-xs text-muted-foreground',
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
        variantClasses[variant],
        weightClasses[weight],
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default Text;