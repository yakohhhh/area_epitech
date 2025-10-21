import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Preferences } from '@capacitor/preferences';

interface AuthState {
  token: string | null;
  loading: boolean;
  user: { id: string; email: string } | null;
  setToken: (token: string | null) => Promise<void>;
  setUser: (user: AuthState['user']) => void;
  login: (token: string, user: AuthState['user']) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (v: boolean) => void;
}

// Bridge Capacitor Preferences + fallback localStorage for web
async function storageSet(key: string, value: string) {
  try { await Preferences.set({ key, value }); } catch { localStorage.setItem(key, value); }
}
async function storageGet(key: string) {
  try { const r = await Preferences.get({ key }); return r.value; } catch { return localStorage.getItem(key); }
}
async function storageRemove(key: string) {
  try { await Preferences.remove({ key }); } catch { localStorage.removeItem(key); }
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  loading: false,
  user: null,
  setLoading: (v) => set({ loading: v }),
  setToken: async (token) => {
    if (token) await storageSet('auth_token', token); else await storageRemove('auth_token');
    set({ token });
  },
  setUser: (user) => set({ user }),
  login: async (token, user) => {
    await storageSet('auth_token', token);
    set({ token, user });
  },
  logout: async () => {
    await storageRemove('auth_token');
    set({ token: null, user: null });
  }
}));
