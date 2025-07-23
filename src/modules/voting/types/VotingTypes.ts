export type VoteType = 'up' | 'down' | 'neutral';

export interface VoteState {
  currentVote: VoteType | null;
  upVotes: number;
  downVotes: number;
  score: number;
  userHasVoted: boolean;
}

export interface VotingContextValue {
  getVoteState: (
    itemId: string,
    upVotesBy: string[],
    downVotesBy: string[],
    userId?: string
  ) => VoteState;
  voteOnThread: (threadId: string, voteType: VoteType) => Promise<void>;
  voteOnComment: (threadId: string, commentId: string, voteType: VoteType) => Promise<void>;
  isVoting: boolean;
}

export interface IVotingService {
  voteOnThread(threadId: string, voteType: VoteType): Promise<void>;
  voteOnComment(threadId: string, commentId: string, voteType: VoteType): Promise<void>;
}

export interface VotingProps {
  itemType: 'thread' | 'comment';
  itemId: string;
  threadId?: string; // Required for comments
  upVotesBy: string[];
  downVotesBy: string[];
  onVoteSuccess?: () => void;
}