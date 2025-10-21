/**
 * Authentication service
 */

import { apiService } from './api';
import type { User, ApiResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

class AuthService {
  private tokenKey = 'auth_token';

  public async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post<{ user: User; token: string }>(
      '/auth/login',
      credentials
    );

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  public async register(
    credentials: RegisterCredentials
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiService.post<{ user: User; token: string }>(
      '/auth/register',
      credentials
    );

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  public logout(): void {
    this.removeToken();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
