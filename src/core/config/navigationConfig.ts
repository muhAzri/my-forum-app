export interface NavigationItem {
  to: string;
  label: string;
}

export const navigationItems: NavigationItem[] = [
  {
    to: '/',
    label: 'Home',
  },
  {
    to: '/leaderboard',
    label: 'Leaderboard',
  },
];
