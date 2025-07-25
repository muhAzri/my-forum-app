import React from 'react';

import { buttonVariants } from '../../utils/button-variants';
import { cn } from '../../utils/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className, variant, size, asChild = false, ...props
  }, ref) => {
    if (asChild) {
      return (
        <span
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as React.HTMLAttributes<HTMLSpanElement>)}
        />
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
