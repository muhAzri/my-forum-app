import { AlertTriangle, Home } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils/utils';
import Button from '../atoms/Button';
import Heading from '../atoms/Heading';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface ErrorLayoutProps {
  title: string;
  message: string;
  statusCode?: number;
  showHomeButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  title,
  message,
  statusCode,
  showHomeButton = true,
  actions,
  className,
}) => (
  <div className={cn('min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8', className)}>
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-error-100 p-4">
          <Icon className="text-error-600" icon={AlertTriangle} size="xl" />
        </div>
      </div>

      {statusCode && (
        <Text className="text-primary-600 mb-2" variant="body" weight="bold">
          {statusCode}
        </Text>
      )}

      <Heading className="text-gray-900 mb-4" level={1}>
        {title}
      </Heading>

      <Text className="text-gray-600 mb-8" variant="body">
        {message}
      </Text>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {showHomeButton && (
          <Button asChild size="lg" variant="default">
            <a href="/">
              <Icon className="mr-2" icon={Home} size="sm" />
              Go Home
            </a>
          </Button>
        )}
        {actions}
      </div>
    </div>
  </div>
);

export default ErrorLayout;