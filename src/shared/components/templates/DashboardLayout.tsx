import React from 'react';

import { cn } from '../../utils/utils';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  sidebar,
  className,
}: DashboardLayoutProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 py-8', className)}>
      <div className="flex items-center justify-between mb-8">
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
        {actions && (
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        )}
      </div>

      <div className={cn('grid gap-8', sidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1')}>
        <div className={sidebar ? 'lg:col-span-3' : ''}>
          {children}
        </div>

        {sidebar && (
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {sidebar}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardLayout;