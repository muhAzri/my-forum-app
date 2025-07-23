import { container } from './Container';
import { AuthService } from '../../features/auth/services/AuthService';
import { ThreadsService } from '../../features/threads/services/ThreadsService';
import { VotingService } from '../../features/voting/services/VotingService';

export function registerServices(): void {
  // Register services as singletons
  container.registerSingleton('AuthService', AuthService);
  container.registerSingleton('ThreadsService', ThreadsService);
  container.registerSingleton('VotingService', VotingService);
}

export function clearServices(): void {
  container.clear();
}