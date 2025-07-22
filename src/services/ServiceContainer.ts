import type { IStorageService } from '@/services/interfaces/IStorageService'
import type { INavigationService } from '@/services/interfaces/INavigationService'
import type { IAuthService } from '@/services/interfaces/IAuthService'
import { LocalStorageService } from './implementations/LocalStorageService'
import { BrowserNavigationService } from './implementations/BrowserNavigationService'
import { AuthService } from './implementations/AuthService'
import { HttpClientService } from './implementations/HttpClientService'

export class ServiceContainer {
  private static instance: ServiceContainer
  private services = new Map<string, unknown>()

  private constructor() {
    this.registerServices()
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  private registerServices(): void {
    const storageService = new LocalStorageService()
    const navigationService = new BrowserNavigationService()
    const authService = new AuthService(storageService)
    const httpClientService = new HttpClientService(authService, navigationService)

    this.services.set('IStorageService', storageService)
    this.services.set('INavigationService', navigationService)
    this.services.set('IAuthService', authService)
    this.services.set('HttpClientService', httpClientService)
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName)
    if (!service) {
      throw new Error(`Service ${serviceName} not found`)
    }
    return service as T
  }

  getStorageService(): IStorageService {
    return this.get<IStorageService>('IStorageService')
  }

  getNavigationService(): INavigationService {
    return this.get<INavigationService>('INavigationService')
  }

  getAuthService(): IAuthService {
    return this.get<IAuthService>('IAuthService')
  }

  getHttpClientService(): HttpClientService {
    return this.get<HttpClientService>('HttpClientService')
  }
}