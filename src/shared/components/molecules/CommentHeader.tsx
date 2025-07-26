import { Calendar } from 'lucide-react';

import { cn } from '../../utils/utils';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

export interface CommentHeaderProps {
  username: string;
  avatarUrl?: string;
  createdAt: string;
  className?: string;
}

function CommentHeader({
  username,
  avatarUrl,
  createdAt,
  className,
}: CommentHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar
        alt={`${username}'s avatar`}
        fallback={username.charAt(0).toUpperCase()}
        size="sm"
        src={avatarUrl}
      />
      <div className="flex flex-col">
        <Text variant="body" weight="medium">
          {username}
        </Text>
        <div className="flex items-center gap-1">
          <Icon className="text-muted-foreground" icon={Calendar} size="xs" />
          <Text variant="muted">
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default CommentHeader;
