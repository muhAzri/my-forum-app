import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) { return text; }
  return `${text.slice(0, maxLength)}...`;
}

export function capitalizeCategory(category: string): string {
  if (!category) { return ''; }
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}
