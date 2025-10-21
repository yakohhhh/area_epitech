/**
 * Authentication service
 */
import { apiClient } from '../../../shared/services/api';
import { ENV } from '../../../shared/config';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '../../../shared/types';

export class AuthService {
  private readonly STORAGE_KEY = 'area_auth_token';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      ENV.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      this.setToken(response.data.accessToken);
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      ENV.ENDPOINTS.AUTH.REGISTER,
      data
    );

    if (response.success && response.data) {
      this.setToken(response.data.accessToken);
      return response.data;
    }

    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(ENV.ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<{ accessToken: string }>(
        ENV.ENDPOINTS.AUTH.REFRESH,
        {}
      );

      if (response.success && response.data) {
        this.setToken(response.data.accessToken);
        return response.data.accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearToken();
    }

    return null;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(ENV.ENDPOINTS.USER.PROFILE);

      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }

    return null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
    apiClient.setAuthToken(token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    apiClient.removeAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      apiClient.setAuthToken(token);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
