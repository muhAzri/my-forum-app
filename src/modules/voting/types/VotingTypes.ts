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
    _itemId: string,
    _upVotesBy: string[],
    _downVotesBy: string[],
    _userId?: string
  ) => VoteState;
  voteOnThread: (_threadId: string, _voteType: VoteType) => Promise<void>;
  voteOnComment: (_threadId: string, _commentId: string, _voteType: VoteType) => Promise<void>;
  isVoting: boolean;
}

export interface IVotingService {
  voteOnThread(_threadId: string, _voteType: VoteType): Promise<void>;
  voteOnComment(_threadId: string, _commentId: string, _voteType: VoteType): Promise<void>;
}

export interface VotingProps {
  itemType: 'thread' | 'comment';
  itemId: string;
  threadId?: string; // Required for comments
  upVotesBy: string[];
  downVotesBy: string[];
  onVoteSuccess?: () => void;
}
