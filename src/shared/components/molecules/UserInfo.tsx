import React from 'react';

import { cn } from '../../utils/utils';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/Text';

export interface UserInfoProps {
  username: string;
  avatarUrl?: string;
  createdAt?: string;
  showDate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  username,
  avatarUrl,
  createdAt,
  showDate = true,
  size = 'md',
  className,
}) => {
  const containerClasses = {
    sm: 'space-x-2',
    md: 'space-x-3',
    lg: 'space-x-4',
  };

  const avatarSizes = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return (
    <div className={cn('flex items-center', containerClasses[size], className)}>
      <Avatar
        alt={`${username}'s avatar`}
        fallback={username.charAt(0).toUpperCase()}
        size={avatarSizes[size]}
        src={avatarUrl}
      />
      <div className="flex flex-col">
        <Text variant={size === 'sm' ? 'small' : 'body'} weight="medium">
          {username}
        </Text>
        {showDate && createdAt && (
          <Text variant="muted">
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        )}
      </div>
    </div>
  );
};

export default UserInfo;