import React, { useState } from 'react';
import { Layout } from '../layout/Layout';
import { LoginForm } from '../../features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = () => {
    // Redirect to dashboard or handle success
    window.location.href = '/dashboard';
  };

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <LoginForm
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
