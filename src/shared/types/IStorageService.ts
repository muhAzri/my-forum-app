export interface IStorageService {
  getItem(_key: string): string | null
  setItem(_key: string, _value: string): void
  removeItem(_key: string): void
  clear(): void
}
