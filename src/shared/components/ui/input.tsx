import React from 'react';

import { cn } from '../../utils/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          className,
        )}
        type={type}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  ),
);

Input.displayName = 'Input';

export { Input };