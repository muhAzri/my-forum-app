import { container } from '../../../core/Container';
import type { IAuthService } from '../../auth/types/AuthTypes';
import type { IVotingService, VoteType } from '../types/VotingTypes';

export class VotingService implements IVotingService {
  private readonly baseURL = 'https://forum-api.dicoding.dev/v1';

  private getAuthService(): IAuthService {
    return container.resolve<IAuthService>('AuthService');
  }

  private getAuthHeaders() {
    const authService = this.getAuthService();
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async voteOnThread(threadId: string, voteType: VoteType): Promise<void> {
    const endpoint = this.getVoteEndpoint('thread', threadId, undefined, voteType);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to vote on thread');
    }
  }

  async voteOnComment(threadId: string, commentId: string, voteType: VoteType): Promise<void> {
    const endpoint = this.getVoteEndpoint('comment', threadId, commentId, voteType);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? 'Failed to vote on comment');
    }
  }

  private getVoteEndpoint(itemType: 'thread' | 'comment', threadId: string, commentId?: string, voteType?: VoteType): string {
    const voteAction = this.getVoteAction(voteType);

    if (itemType === 'thread') {
      return `${this.baseURL}/threads/${threadId}/${voteAction}`;
    }
    return `${this.baseURL}/threads/${threadId}/comments/${commentId}/${voteAction}`;
  }

  private getVoteAction(voteType?: VoteType): string {
    switch (voteType) {
      case 'up':
        return 'up-vote';
      case 'down':
        return 'down-vote';
      case 'neutral':
        return 'neutral-vote';
      default:
        return 'neutral-vote';
    }
  }
}
