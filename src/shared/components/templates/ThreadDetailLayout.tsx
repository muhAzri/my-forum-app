import React from 'react';

import { cn } from '../../utils/utils';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';

interface ThreadDetailLayoutProps {
  children: React.ReactNode;
  thread?: {
    title: string;
    author: string;
    createdAt: string;
  };
  sidebar?: React.ReactNode;
  className?: string;
}

const ThreadDetailLayout: React.FC<ThreadDetailLayoutProps> = ({
  children,
  thread,
  sidebar,
  className,
}) => (
  <div className={cn('max-w-7xl mx-auto px-4 py-8', className)}>
    {thread && (
      <div className="mb-8">
        <Heading className="mb-2" level={1}>
          {thread.title}
        </Heading>
        <Text variant="muted">
          By {thread.author} • {new Date(thread.createdAt).toLocaleDateString()}
        </Text>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
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

export default ThreadDetailLayout;