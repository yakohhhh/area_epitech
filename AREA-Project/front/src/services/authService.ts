const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface LoginRequest {
  email: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  username?: string | null;
  message: string;
}

export interface LoginResponse extends AuthResponse {
  access_token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new Error(
          error.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur réseau est survenue');
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginWithGoogle(): Promise<string> {
    // Retourner l'URL de redirection Google OAuth (pour connexion/auto-création)
    return `${API_BASE_URL}/auth/google`;
  }

  async registerWithGoogle(): Promise<string> {
    // Utiliser la route spécifique pour l'inscription Google
    return `${API_BASE_URL}/auth/google/register`;
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return this.makeRequest<{ available: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
  }

  async checkUsernameAvailability(
    username: string
  ): Promise<{ available: boolean }> {
    return this.makeRequest<{ available: boolean }>(
      `/auth/check-username?username=${encodeURIComponent(username)}`
    );
  }
}

export const authService = new AuthService();
export default authService;
