import React from 'react';

import { cn } from '../../utils/utils';
import Avatar from '../atoms/Avatar';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';

interface UserProfileProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  truncate?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  avatarUrl,
  avatarSize = 'md',
  layout = 'horizontal',
  truncate = false,
  className,
}) => {
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={cn(
        'flex items-center',
        isHorizontal ? 'space-x-3' : 'flex-col space-y-2 text-center',
        className,
      )}
    >
      <Avatar
        alt={`${name}'s avatar`}
        className="flex-shrink-0"
        fallback={name.charAt(0).toUpperCase()}
        size={avatarSize}
        src={avatarUrl}
      />

      <div className={cn('flex-1', truncate && 'min-w-0')}>
        <Heading
          className={cn(
            'text-gray-900',
            truncate && 'truncate',
          )}
          level={isHorizontal ? 3 : 4}
          weight="semibold"
        >
          {name}
        </Heading>
        {email && (
          <Text
            className={cn(
              'text-gray-500',
              truncate && 'truncate',
            )}
            variant="small"
          >
            {email}
          </Text>
        )}
      </div>
    </div>
  );
};

export default UserProfile;