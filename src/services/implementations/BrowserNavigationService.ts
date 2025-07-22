import type { INavigationService } from '@/services/interfaces/INavigationService'

export class BrowserNavigationService implements INavigationService {
  navigateTo(path: string): void {
    window.location.href = path
  }

  getCurrentPath(): string {
    return window.location.pathname
  }
}