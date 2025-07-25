import { AuthService } from '../modules/auth/services/AuthService';
import { ThreadsService } from '../modules/threads/services/ThreadsService';
import { VotingService } from '../modules/voting/services/VotingService';

import { container } from './Container';

export function registerServices(): void {
  container.registerSingleton('AuthService', AuthService);
  container.registerSingleton('ThreadsService', ThreadsService);
  container.registerSingleton('VotingService', VotingService);
}

export function clearServices(): void {
  container.clear();
}
