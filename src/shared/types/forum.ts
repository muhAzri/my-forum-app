export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  ownerId: string;
  upVotesBy: string[];
  downVotesBy: string[];
  totalComments: number;
}

export interface ThreadDetail extends Omit<Thread, 'ownerId'> {
  owner: User;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: User;
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface Vote {
  id: string;
  userId: string;
  threadId?: string;
  commentId?: string;
  voteType: 1 | 0 | -1;
}

export interface LeaderboardEntry {
  user: User;
  score: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface ThreadsState {
  threads: Thread[];
  currentThread: ThreadDetail | null;
  categories: string[];
  selectedCategory: string | null;
  isLoading: boolean;
  isVoting: boolean;
  isCreating: boolean;
  error: string | null;
}

export interface LeaderboardState {
  leaderboards: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

export interface LoadingState {
  [key: string]: boolean;
}
