export interface IAuthService {
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
  isAuthenticated(): boolean
}