import type { FeatureCardData, StatsCardData } from '../../shared/types/CardTypes';

export const featureCards: FeatureCardData[] = [
  {
    title: 'Latest Discussions',
    description: 'Catch up on the most recent forum conversations',
    content: 'No discussions yet. Be the first to start a conversation!',
    buttonText: 'View All',
    onButtonClick: () => {},
  },
  {
    title: 'Popular Topics',
    description: 'Trending topics in our community',
    content: 'Discover what everyone is talking about.',
    buttonText: 'Explore',
    buttonVariant: 'outline' as const,
    onButtonClick: () => {},
  },
];

export const statsCard: StatsCardData = {
  title: 'Community Stats',
  description: 'See how active our community is',
  stats: [
    { label: 'Members', value: '1,247' },
    { label: 'Posts', value: '8,934' },
    { label: 'Topics', value: '456' },
  ],
};

export const actionButtons = [
  {
    text: 'Create New Topic',
    size: 'lg' as const,
    className: 'mr-4',
    onClick: () => {},
  },
  {
    text: 'Browse Categories',
    variant: 'outline' as const,
    size: 'lg' as const,
    onClick: () => {},
  },
];