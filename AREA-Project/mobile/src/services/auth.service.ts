import { AuthAPI, UserAPI } from './api';
import { useAuthStore } from '../state/useAuthStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  username?: string;
  access_token: string;
  message?: string;
}

export class MobileAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await AuthAPI.login(credentials.email, credentials.password);
      
      if (response.access_token) {
        // Auto-login after successful authentication
        const userData = {
          id: response.id,
          email: response.email,
          username: response.username
        };
        
        await useAuthStore.getState().login(response.access_token, userData);
        return response;
      }
      
      throw new Error(response.message || 'Authentication failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await AuthAPI.register(data.email, data.username, data.password);
      
      if (response.access_token) {
        // Auto-login after successful registration
        const userData = {
          id: response.id,
          email: response.email,
          username: response.username
        };
        
        await useAuthStore.getState().login(response.access_token, userData);
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await useAuthStore.getState().logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      await useAuthStore.getState().logout();
    }
  }

  async getCurrentUser() {
    try {
      return await UserAPI.me();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  getGoogleAuthUrl(): string {
    return AuthAPI.googleAuth();
  }

  isAuthenticated(): boolean {
    return !!useAuthStore.getState().token;
  }

  getToken(): string | null {
    return useAuthStore.getState().token;
  }

  getUser() {
    return useAuthStore.getState().user;
  }
}

export const mobileAuthService = new MobileAuthService();

// Legacy function for backward compatibility
export async function performLogin(email: string, password: string) {
  const { setLoading } = useAuthStore.getState();
  setLoading(true);
  try {
    await mobileAuthService.login({ email, password });
  } finally {
    setLoading(false);
  }
}
