import React from 'react';

import { cn } from '../../utils/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({
    className, required, children, ...props
  }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-foreground',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  ),
);

Label.displayName = 'Label';

export default Label;
