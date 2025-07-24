import type { LucideIcon } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils/utils';
import Button from '../atoms/Button';
import Heading from '../atoms/Heading';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'default' | 'outline' | 'ghost';
  };
  className?: string;
}

function EmptyState({
  icon,
  title,
  message,
  actionButton,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-gray-100 p-4">
            <Icon className="text-gray-400" icon={icon} size="xl" />
          </div>
        </div>
      )}

      <Heading className="text-gray-900 mb-2" level={3}>
        {title}
      </Heading>

      <Text className="text-gray-600 mb-6 max-w-sm mx-auto" variant="body">
        {message}
      </Text>

      {actionButton && (
        <Button
          asChild={!!actionButton.href}
          onClick={actionButton.onClick}
          variant={actionButton.variant ?? 'default'}
        >
          {actionButton.href ? (
            <a href={actionButton.href}>
              {actionButton.label}
            </a>
          ) : (
            actionButton.label
          )}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;