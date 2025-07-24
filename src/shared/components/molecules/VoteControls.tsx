import { ChevronUp, ChevronDown } from 'lucide-react';
import React from 'react';

import { cn } from '../../utils/utils';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';

export interface VoteControlsProps {
  upVotes: number;
  downVotes: number;
  userVote?: 1 | -1 | null;
  onUpVote: () => void;
  onDownVote: () => void;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
  className?: string | undefined;
}

function VoteControls({
  upVotes,
  downVotes,
  userVote,
  onUpVote,
  onDownVote,
  disabled = false,
  orientation = 'vertical',
  size = 'md',
  className,
}: VoteControlsProps) {
  const totalScore = upVotes - downVotes;

  const containerClasses = {
    vertical: 'flex flex-col items-center space-y-1',
    horizontal: 'flex items-center space-x-2',
  };

  const buttonSize = size === 'sm' ? 'sm' : 'default';

  return (
    <div className={cn(containerClasses[orientation], className)}>
      <Button
        className={cn(
          'p-1',
          userVote === 1 && 'text-success-600 bg-success-50 hover:bg-success-100',
        )}
        disabled={disabled}
        onClick={onUpVote}
        size={buttonSize}
        variant={userVote === 1 ? 'default' : 'ghost'}
      >
        <Icon icon={ChevronUp} size={size === 'sm' ? 'sm' : 'md'} />
      </Button>

      <Text
        className={cn(
          userVote === 1 && 'text-success-600',
          userVote === -1 && 'text-destructive',
        )}
        variant={size === 'sm' ? 'small' : 'body'}
        weight="medium"
      >
        {totalScore}
      </Text>

      <Button
        className={cn(
          'p-1',
          userVote === -1 && 'text-destructive bg-destructive/10 hover:bg-destructive/20',
        )}
        disabled={disabled}
        onClick={onDownVote}
        size={buttonSize}
        variant={userVote === -1 ? 'default' : 'ghost'}
      >
        <Icon icon={ChevronDown} size={size === 'sm' ? 'sm' : 'md'} />
      </Button>
    </div>
  );
}

export default VoteControls;