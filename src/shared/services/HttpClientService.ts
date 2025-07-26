import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import type { IAuthService } from '../types/IAuthService';
import type { INavigationService } from '../types/INavigationService';

export class HttpClientService {
  private readonly client: AxiosInstance;

  private readonly authService: IAuthService;

  private readonly navigationService: INavigationService;

  constructor(
    authService: IAuthService,
    navigationService: INavigationService,
    baseURL = import.meta.env['VITE_API_URL'],
  ) {
    if (!baseURL) {
      throw new Error('VITE_API_URL environment variable is required');
    }
    this.authService = authService;
    this.navigationService = navigationService;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.authService.getToken();
        if (token && config.headers) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.authService.removeToken();
          this.navigationService.navigateTo('/login');
        }
        return Promise.reject(error);
      },
    );
  }

  get axiosInstance(): AxiosInstance {
    return this.client;
  }
}
