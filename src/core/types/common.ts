// Value Objects
export class UserId {
  constructor(public readonly value: string) {
    if (!value.trim()) {
      throw new Error('UserId cannot be empty');
    }
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}

export class ThreadId {
  constructor(public readonly value: string) {
    if (!value.trim()) {
      throw new Error('ThreadId cannot be empty');
    }
  }

  equals(other: ThreadId): boolean {
    return this.value === other.value;
  }
}

export class CommentId {
  constructor(public readonly value: string) {
    if (!value.trim()) {
      throw new Error('CommentId cannot be empty');
    }
  }

  equals(other: CommentId): boolean {
    return this.value === other.value;
  }
}

// Domain Types
export type VoteType = 'up' | 'down' | 'neutral';
export type ThreadCategory = 'general' | 'redux' | 'react';

// Result Pattern for Error Handling
export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

export const Result = {
  success: <T>(data: T): Result<T> => ({ success: true, data }),
  failure: <E = Error>(error: E): Result<never, E> => ({ success: false, error }),
};

// Common interfaces
export interface IDomainEvent {
  occurredOn: Date;
  eventId: string;
}

export interface IEntity {
  getId(): string;
  equals(other: IEntity): boolean;
}