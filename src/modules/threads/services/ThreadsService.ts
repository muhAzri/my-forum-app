import { container } from '../../../core/Container';
import type { IAuthService } from '../../auth/types/AuthTypes';
import type {
  IThreadsService,
  Thread,
  ThreadDetail,
  CreateThreadData,
  CreateCommentData,
  Comment,
} from '../types/ThreadTypes';

export class ThreadsService implements IThreadsService {
  private readonly baseURL = import.meta.env['VITE_API_URL'];

  constructor() {
    if (!this.baseURL) {
      throw new Error('VITE_API_URL environment variable is required');
    }
  }

  private getAuthService(): IAuthService {
    return container.resolve<IAuthService>('AuthService');
  }

  private getAuthHeaders() {
    const authService = this.getAuthService();
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getThreads(): Promise<Thread[]> {
    const response = await fetch(`${this.baseURL}/threads`);

    if (!response.ok) {
      throw new Error('Failed to fetch threads');
    }

    const data = await response.json();
    return data.data.threads;
  }

  async getThreadDetail(id: string): Promise<ThreadDetail> {
    const response = await fetch(`${this.baseURL}/threads/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch thread detail');
    }

    const data = await response.json();
    return data.data.detailThread;
  }

  async createThread(data: CreateThreadData): Promise<Thread> {
    const response = await fetch(`${this.baseURL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({
        title: data.title,
        body: data.body,
        category: data.category ?? 'general',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to create thread');
    }

    const result = await response.json();
    return result.data.thread;
  }

  async createComment(threadId: string, data: CreateCommentData): Promise<Comment> {
    const response = await fetch(`${this.baseURL}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({
        content: data.content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to create comment');
    }

    const result = await response.json();
    return result.data.comment;
  }

  async voteThread(threadId: string, voteType: 'up' | 'down' | 'neutral'): Promise<void> {
    let endpoint: string;
    let method: string;

    if (voteType === 'up') {
      endpoint = `${this.baseURL}/threads/${threadId}/up-vote`;
      method = 'POST';
    } else if (voteType === 'down') {
      endpoint = `${this.baseURL}/threads/${threadId}/down-vote`;
      method = 'POST';
    } else {
      endpoint = `${this.baseURL}/threads/${threadId}/neutral-vote`;
      method = 'POST';
    }

    const response = await fetch(endpoint, {
      method,
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to vote on thread');
    }
  }

  async voteComment(threadId: string, commentId: string, voteType: 'up' | 'down' | 'neutral'): Promise<void> {
    let endpoint: string;
    let method: string;

    if (voteType === 'up') {
      endpoint = `${this.baseURL}/threads/${threadId}/comments/${commentId}/up-vote`;
      method = 'POST';
    } else if (voteType === 'down') {
      endpoint = `${this.baseURL}/threads/${threadId}/comments/${commentId}/down-vote`;
      method = 'POST';
    } else {
      endpoint = `${this.baseURL}/threads/${threadId}/comments/${commentId}/neutral-vote`;
      method = 'POST';
    }

    const response = await fetch(endpoint, {
      method,
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to vote on comment');
    }
  }
}
