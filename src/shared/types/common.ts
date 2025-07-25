export class UserId {
  public readonly value: string;

  constructor(value: string) {
    if (!value.trim()) {
      throw new Error('UserId cannot be empty');
    }
    this.value = value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}

export class ThreadId {
  public readonly value: string;

  constructor(value: string) {
    if (!value.trim()) {
      throw new Error('ThreadId cannot be empty');
    }
    this.value = value;
  }

  equals(other: ThreadId): boolean {
    return this.value === other.value;
  }
}

export class CommentId {
  public readonly value: string;

  constructor(value: string) {
    if (!value.trim()) {
      throw new Error('CommentId cannot be empty');
    }
    this.value = value;
  }

  equals(other: CommentId): boolean {
    return this.value === other.value;
  }
}

export type VoteType = 'up' | 'down' | 'neutral';
export type ThreadCategory = 'general' | 'redux' | 'react';

export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

export const Result = {
  success: <T>(data: T): Result<T> => ({ success: true, data }),
  failure: <E = Error>(error: E): Result<never, E> => ({ success: false, error }),
};

export interface IDomainEvent {
  occurredOn: Date;
  eventId: string;
}

export interface IEntity {
  getId(): string;
  equals(_other: IEntity): boolean;
}
