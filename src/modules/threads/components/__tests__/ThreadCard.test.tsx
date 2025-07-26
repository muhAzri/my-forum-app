import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import type { Thread, User } from '../../../../shared/types/forum';
import { ThreadCard } from '../ThreadCard';

jest.mock('../../../../shared/utils/sanitize', () => ({
  createExcerpt: jest.fn((text: string) => `${text.substring(0, 50)}...`),
}));

jest.mock('../../../../shared/utils/utils', () => ({
  formatTimeAgo: jest.fn(() => '2 hours ago'),
  capitalizeCategory: jest.fn((category: string) => (
    category.charAt(0).toUpperCase() + category.slice(1)
  )),
}));

describe('ThreadCard Component Tests', () => {
  const mockThread: Thread = {
    id: 'thread-123',
    title: 'Test Thread Title',
    body: 'This is a test thread body content.',
    category: 'general',
    createdAt: '2024-01-01T10:00:00Z',
    ownerId: 'user-1',
    upVotesBy: ['user-2', 'user-3'],
    downVotesBy: ['user-4'],
    totalComments: 15,
  };

  const mockAuthor: User = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  const renderWithRouter = (ui: React.ReactElement) => render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
  );

  describe('basic rendering', () => {
    test('should render without crashing with required props', () => {
      const { container } = renderWithRouter(
        <ThreadCard thread={mockThread} author={mockAuthor} />,
      );

      expect(container.firstChild).toBeTruthy();
    });

    test('should render without author', () => {
      const { container } = renderWithRouter(
        <ThreadCard thread={mockThread} />,
      );

      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('content display', () => {
    test('should display thread title', () => {
      const { getByText } = renderWithRouter(
        <ThreadCard thread={mockThread} author={mockAuthor} />,
      );

      expect(getByText('Test Thread Title')).toBeInTheDocument();
    });

    test('should display category', () => {
      const { getByText } = renderWithRouter(
        <ThreadCard thread={mockThread} author={mockAuthor} />,
      );

      expect(getByText('General')).toBeInTheDocument();
    });

    test('should display vote counts', () => {
      const { getByText } = renderWithRouter(
        <ThreadCard thread={mockThread} author={mockAuthor} />,
      );

      expect(getByText('2')).toBeInTheDocument(); // upvotes
      expect(getByText('1')).toBeInTheDocument(); // downvotes
      expect(getByText('15')).toBeInTheDocument(); // comments
    });
  });

  describe('author display', () => {
    test('should display author name when provided', () => {
      const { getByText } = renderWithRouter(
        <ThreadCard thread={mockThread} author={mockAuthor} />,
      );

      expect(getByText('John Doe')).toBeInTheDocument();
    });

    test('should display unknown user when no author', () => {
      const { getByText } = renderWithRouter(
        <ThreadCard thread={mockThread} />,
      );

      expect(getByText('Unknown User')).toBeInTheDocument();
    });

    test('should calculate vote score correctly', () => {
      const { getByText } = renderWithRouter(
        <ThreadCard thread={mockThread} author={mockAuthor} />,
      );

      // Vote score = upvotes (2) - downvotes (1) = +1
      expect(getByText('+1')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    test('should handle zero votes', () => {
      const threadWithNoVotes = {
        ...mockThread,
        upVotesBy: [],
        downVotesBy: [],
      };

      const { getAllByText } = renderWithRouter(
        <ThreadCard thread={threadWithNoVotes} author={mockAuthor} />,
      );

      const zeroElements = getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    test('should handle negative vote score', () => {
      const threadWithNegativeScore = {
        ...mockThread,
        upVotesBy: ['user-1'],
        downVotesBy: ['user-2', 'user-3', 'user-4'],
      };

      const { getByText } = renderWithRouter(
        <ThreadCard thread={threadWithNegativeScore} author={mockAuthor} />,
      );

      expect(getByText('-2')).toBeInTheDocument();
    });
  });
});
