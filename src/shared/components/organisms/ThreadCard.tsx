import { MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

import type { Thread } from '../../types/forum';
import { createExcerpt } from '../../utils/sanitize';
import { capitalizeCategory, cn } from '../../utils/utils';
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

function ThreadCard({ thread, author, className }: ThreadCardProps) {
  const voteScore = thread.upVotesBy.length - thread.downVotesBy.length;

  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow animate-fade-in-up',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <ThreadMeta
            category={capitalizeCategory(thread.category)}
            className="mb-3"
            commentCount={thread.totalComments}
            createdAt={thread.createdAt}
          />

          <Link className="block group" to={`/threads/${thread.id}`}>
            <Heading
              className="text-card-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 sm:line-clamp-none"
              level={3}
              weight="semibold"
            >
              {thread.title}
            </Heading>
            {thread.body && (
              <Text className="text-muted-foreground line-clamp-2 sm:line-clamp-3" variant="body">
                {createExcerpt(thread.body, 150)}
              </Text>
            )}
          </Link>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <UserInfo
              avatarUrl={author?.avatar ?? ''}
              showDate={false}
              size="sm"
              username={author?.name ?? 'Unknown User'}
            />

            <div className="flex items-center justify-between sm:justify-end space-x-4 text-sm text-muted-foreground">
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

        <div className="sm:ml-4 flex sm:flex-col items-center justify-center sm:justify-start">
          <Text
            className={cn(
              'text-lg sm:text-xl',
              voteScore > 0 && 'text-success',
              voteScore < 0 && 'text-error',
              voteScore === 0 && 'text-muted-foreground',
            )}
            variant="body"
            weight="semibold"
          >
            {voteScore > 0 ? '+' : ''}
            {voteScore}
          </Text>
          <Text className="ml-1 sm:ml-0" variant="caption">votes</Text>
        </div>
      </div>
    </div>
  );
}

export default ThreadCard;
