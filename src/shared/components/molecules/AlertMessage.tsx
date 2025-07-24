import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils/utils';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

export interface AlertMessageProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  children,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className,
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500',
    },
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: CheckCircle,
      iconColor: 'text-success-500',
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: AlertCircle,
      iconColor: 'text-warning-500',
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-800',
      icon: XCircle,
      iconColor: 'text-error-500',
    },
  };

  const config = variants[variant];

  return (
    <div
      className={cn(
        'relative rounded-md border p-4',
        config.container,
        className,
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={config.iconColor}
            icon={config.icon}
            size="md"
          />
        </div>
        <div className="ml-3 flex-1">
          <Text className="inherit" variant="small">
            {children}
          </Text>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <Button
              className="p-1 h-auto -m-1.5 hover:bg-black/5"
              onClick={onDismiss}
              size="sm"
              variant="ghost"
            >
              <Icon icon={X} size="sm" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;