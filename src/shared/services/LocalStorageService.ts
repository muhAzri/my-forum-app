import type { IStorageService } from '../types/IStorageService';

export class LocalStorageService implements IStorageService {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage operations may fail in some environments (e.g., incognito mode)
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage operations may fail in some environments (e.g., incognito mode)
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // localStorage operations may fail in some environments (e.g., incognito mode)
    }
  }
}
