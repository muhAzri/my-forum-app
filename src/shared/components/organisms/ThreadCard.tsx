import { MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import React from 'react';

import type { Thread } from '../../../shared/types/forum';
import { createExcerpt } from '../../../shared/utils/sanitize';
import { capitalizeCategory, cn } from '../../../shared/utils/utils';
import Heading from '../atoms/Heading';
import Icon from '../atoms/Icon';
import Link from '../atoms/Link';
import Text from '../atoms/Text';
import ThreadMeta from '../molecules/ThreadMeta';
import UserInfo from '../molecules/UserInfo';

interface ThreadCardProps {
  thread: Thread;
  author?: { name: string; avatar?: string };
  className?: string;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, author, className }) => {
  const voteScore = thread.upVotesBy.length - thread.downVotesBy.length;

  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow animate-fade-in-up',
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <ThreadMeta
            category={capitalizeCategory(thread.category)}
            className="mb-3"
            commentCount={thread.totalComments}
            createdAt={thread.createdAt}
          />

          <Link className="block group" to={`/threads/${thread.id}`}>
            <Heading
              className="text-card-foreground group-hover:text-primary transition-colors mb-2"
              level={3}
              weight="semibold"
            >
              {thread.title}
            </Heading>
            {thread.body && (
              <Text className="text-muted-foreground line-clamp-3" variant="body">
                {createExcerpt(thread.body, 150)}
              </Text>
            )}
          </Link>

          <div className="mt-4 flex items-center justify-between">
            <UserInfo
              avatarUrl={author?.avatar}
              showDate={false}
              size="sm"
              username={author?.name ?? 'Unknown User'}
            />

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon icon={ThumbsUp} size="sm" />
                <Text variant="small">{thread.upVotesBy.length}</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Icon icon={ThumbsDown} size="sm" />
                <Text variant="small">{thread.downVotesBy.length}</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Icon icon={MessageCircle} size="sm" />
                <Text variant="small">{thread.totalComments}</Text>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-center">
          <Text
            className={cn(
              'text-lg',
              voteScore > 0 && 'text-success',
              voteScore < 0 && 'text-error',
              voteScore === 0 && 'text-muted-foreground',
            )}
            variant="body"
            weight="semibold"
          >
            {voteScore > 0 ? '+' : ''}{voteScore}
          </Text>
          <Text variant="caption">votes</Text>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;