import React from 'react';

import Input, { type InputProps } from '../atoms/Input';
import Label from '../atoms/Label';
import Text from '../atoms/Text';

export interface FormFieldProps extends Omit<InputProps, 'error'> {
  label?: string;
  error?: string | undefined;
  required?: boolean | undefined;
  helperText?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, helperText, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} required={required}>
          {label}
        </Label>
      )}
      <Input
        ref={ref}
        className={className}
        error={!!error}
        {...props}
      />
      {error && (
        <Text className="text-destructive" variant="small">
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text variant="muted">
          {helperText}
        </Text>
      )}
    </div>
  ),
);

FormField.displayName = 'FormField';

export default FormField;