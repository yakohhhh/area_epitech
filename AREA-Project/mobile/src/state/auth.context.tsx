import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from './useAuthStore';

interface AuthContextValue {
  token: string | null;
  user: { id: string; email: string } | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, setToken, logout, loading, setLoading } = useAuthStore();

  useEffect(() => { /* placeholder: could fetch user details */ }, [token]);

  const login = async (tk: string) => {
    setLoading(true);
    await setToken(tk);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
