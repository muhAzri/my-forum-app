export interface INavigationService {
  navigateTo(path: string): void
  getCurrentPath(): string
}