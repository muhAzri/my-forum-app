import { cn } from '../../utils/utils';
import Avatar from '../atoms/Avatar';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';

interface UserProfileProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'responsive';
  truncate?: boolean;
  className?: string;
}

function UserProfile({
  name,
  email,
  avatarUrl,
  avatarSize = 'md',
  layout = 'horizontal',
  truncate = false,
  className,
}: UserProfileProps) {
  const isHorizontal = layout === 'horizontal';
  const isVertical = layout === 'vertical';
  const isResponsive = layout === 'responsive';

  return (
    <div
      className={cn(
        'flex items-center',
        isHorizontal && 'space-x-3',
        isVertical && 'flex-col space-y-2 text-center',
        isResponsive && 'flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left',
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
          level={isVertical ? 4 : 3}
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
}

export default UserProfile;
