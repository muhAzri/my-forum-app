import { Calendar, MessageSquare } from 'lucide-react';

import { cn } from '../../utils/utils';
import Badge from '../atoms/Badge';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

export interface ThreadMetaProps {
  category?: string;
  createdAt: string;
  commentCount?: number;
  className?: string;
}

function ThreadMeta({
  category,
  createdAt,
  commentCount,
  className,
}: ThreadMetaProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {category && (
        <Badge size="sm" variant="info">
          {category}
        </Badge>
      )}

      <div className="flex items-center gap-1">
        <Icon className="text-muted-foreground" icon={Calendar} size="xs" />
        <Text variant="muted">
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      </div>

      {commentCount !== undefined && (
        <div className="flex items-center gap-1">
          <Icon className="text-muted-foreground" icon={MessageSquare} size="xs" />
          <Text variant="muted">
            {commentCount}
            {' '}
            {commentCount === 1 ? 'comment' : 'comments'}
          </Text>
        </div>
      )}
    </div>
  );
}

export default ThreadMeta;
