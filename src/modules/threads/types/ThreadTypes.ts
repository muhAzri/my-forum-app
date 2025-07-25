export interface Thread {
  id: string;
  title: string;
  body: string;
  category: 'general' | 'redux' | 'react';
  user: string;
  upVotesBy: string[];
  downVotesBy: string[];
  createdAt: string;
  totalComments: number;
}

export interface ThreadDetail extends Thread {
  comments: Comment[];
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  upVotesBy: string[];
  downVotesBy: string[];
}

export interface CreateThreadData {
  title: string;
  body: string;
  category?: 'general' | 'redux' | 'react';
}

export interface CreateCommentData {
  content: string;
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

export interface IThreadsService {
  getThreads(): Promise<Thread[]>;
  getThreadDetail(id: string): Promise<ThreadDetail>;
  createThread(data: CreateThreadData): Promise<Thread>;
  createComment(threadId: string, data: CreateCommentData): Promise<Comment>;
  voteThread(threadId: string, voteType: 'up' | 'down' | 'neutral'): Promise<void>;
  voteComment(threadId: string, commentId: string, voteType: 'up' | 'down' | 'neutral'): Promise<void>;
}
