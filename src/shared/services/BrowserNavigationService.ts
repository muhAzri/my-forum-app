import type { INavigationService } from '../types/INavigationService';

export class BrowserNavigationService implements INavigationService {
  navigateTo(path: string): void {
    window.location.href = path;
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }
}