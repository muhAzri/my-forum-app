import type { IAuthService } from '../types/IAuthService';
import type { IStorageService } from '../types/IStorageService';

export class AuthService implements IAuthService {
  private readonly TOKEN_KEY = 'authToken';

  private readonly storageService: IStorageService;

  constructor(storageService: IStorageService) {
    this.storageService = storageService;
  }

  getToken(): string | null {
    return this.storageService.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }
}
