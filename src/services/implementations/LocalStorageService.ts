import type { IStorageService } from '@/services/interfaces/IStorageService'

export class LocalStorageService implements IStorageService {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silent fail for localStorage save operation
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silent fail for localStorage remove operation
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch {
      // Silent fail for localStorage clear operation
    }
  }
}