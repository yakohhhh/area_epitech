import React, { useState } from 'react';
import { authService } from '../services/auth';
import type { LoginCredentials } from '../../../shared/types';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login(credentials);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: keyof LoginCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={credentials.email}
          onChange={handleChange('email')}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={handleChange('password')}
          required
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
