import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import type { User } from '../../../shared/types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.login({ email, password });
      setUser(authResponse.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        authService.initializeAuth();
        await refreshUser();
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };
};
