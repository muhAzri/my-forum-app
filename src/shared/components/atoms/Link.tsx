import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { cn } from '../../utils/utils';

export interface LinkProps extends React.ComponentProps<typeof RouterLink> {
  variant?: 'default' | 'muted' | 'accent';
  underline?: 'hover' | 'always' | 'none';
  external?: boolean;
}

const Link: React.FC<LinkProps> = ({
  children,
  className,
  variant = 'default',
  underline = 'hover',
  external,
  ...props
}) => {
  const variantClasses = {
    default: 'text-primary-600 hover:text-primary-700',
    muted: 'text-muted-foreground hover:text-foreground',
    accent: 'text-accent-600 hover:text-accent-700',
  };

  const underlineClasses = {
    hover: 'hover:underline',
    always: 'underline',
    none: 'no-underline',
  };

  const baseClasses = cn(
    'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm',
    variantClasses[variant],
    underlineClasses[underline],
    className,
  );

  if (external) {
    return (
      <a
        className={baseClasses}
        href={props.to as string}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink className={baseClasses} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;