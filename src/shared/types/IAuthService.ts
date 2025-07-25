export interface IAuthService {
  getToken(): string | null
  setToken(_token: string): void
  removeToken(): void
  isAuthenticated(): boolean
}
