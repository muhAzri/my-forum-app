export interface INavigationService {
  navigateTo(_path: string): void
  getCurrentPath(): string
}
