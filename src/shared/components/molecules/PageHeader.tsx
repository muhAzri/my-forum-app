import React from 'react';

import { cn } from '../../utils/utils';
import Button from '../atoms/Button';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'default' | 'outline' | 'ghost';
  };
  className?: string;
}

function PageHeader({
  title,
  subtitle,
  actionButton,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-8', className)}>
      <div>
        <Heading className="mb-2" level={1}>
          {title}
        </Heading>
        {subtitle && (
          <Text className="text-muted-foreground" variant="body">
            {subtitle}
          </Text>
        )}
      </div>

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

export default PageHeader;