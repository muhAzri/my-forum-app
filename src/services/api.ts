import type { User, Thread, ThreadDetail, Comment, LeaderboardEntry, ApiResponse } from '../types/forum';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

class ApiError extends Error {
  public status?: number | undefined;

  constructor(message: string, status?: number | undefined) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`API Error: ${errorText}`, response.status);
  }

  const data: ApiResponse<T> = await response.json();
  return data.data;
};

export const authApi = {
  async register(userData: { name: string; email: string; password: string }): Promise<User> {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleApiResponse<{ user: User }>(response);
    return data.user;
  },

  async login(credentials: { email: string; password: string }): Promise<string> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleApiResponse<{ token: string }>(response);
    return data.token;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleApiResponse<{ user: User }>(response);
    return data.user;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await handleApiResponse<{ users: User[] }>(response);
    return data.users;
  },
};

export const threadsApi = {
  async getAllThreads(): Promise<Thread[]> {
    const response = await fetch(`${BASE_URL}/threads`);
    const data = await handleApiResponse<{ threads: Thread[] }>(response);
    return data.threads;
  },

  async getThreadDetail(threadId: string): Promise<ThreadDetail> {
    const response = await fetch(`${BASE_URL}/threads/${threadId}`);
    const data = await handleApiResponse<{ detailThread: ThreadDetail }>(response);
    return data.detailThread;
  },

  async createThread(
    threadData: { title: string; body: string; category?: string },
    token: string,
  ): Promise<Thread> {
    const response = await fetch(`${BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(threadData),
    });

    const data = await handleApiResponse<{ thread: Thread }>(response);
    return data.thread;
  },

  async createComment(
    threadId: string,
    content: string,
    token: string,
  ): Promise<Comment> {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    const data = await handleApiResponse<{ comment: Comment }>(response);
    return data.comment;
  },

  async voteThread(
    threadId: string,
    voteType: 'up' | 'down' | 'neutral',
    token: string,
  ): Promise<void> {
    await fetch(`${BASE_URL}/threads/${threadId}/${voteType}-vote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async voteComment(
    threadId: string,
    commentId: string,
    voteType: 'up' | 'down' | 'neutral',
    token: string,
  ): Promise<void> {
    await fetch(`${BASE_URL}/threads/${threadId}/comments/${commentId}/${voteType}-vote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const leaderboardApi = {
  async getLeaderboards(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${BASE_URL}/leaderboards`);
    const data = await handleApiResponse<{ leaderboards: LeaderboardEntry[] }>(response);
    return data.leaderboards;
  },
};

export const api = {
  auth: authApi,
  threads: threadsApi,
  leaderboard: leaderboardApi,
};