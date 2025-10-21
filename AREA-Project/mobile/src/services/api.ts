import axios from 'axios';
import { useAuthStore } from '../state/useAuthStore';

// Configurable via .env (Vite prefix)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = axios.create({ baseURL, timeout: 15001 });
export const apiService = api;

// Attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic error handling (can be expanded per API shape)
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// API endpoints wrappers
export const AuthAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  
  register: async (email: string, username: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, username, password });
    return data;
  },

  googleAuth: () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    return `${apiUrl}/auth/google?origin=mobile`;
  }
};

export const UserAPI = {
  me: async () => {
    const { data } = await api.get('/user/me');
    return data;
  },

  updateProfile: async (profileData: any) => {
    const { data } = await api.put('/user/profile', profileData);
    return data;
  }
};

export const MobileAPI = {
  health: async () => {
    const { data } = await api.get('/mobile/health');
    return data;
  },

  corsTest: async () => {
    const { data } = await api.get('/mobile/cors-test');
    return data;
  }
};

// Intégrations API
export const IntegrationsAPI = {
  // Google Calendar
  createCalendarEvent: async (eventData: any) => {
    const { data } = await api.post('/google-calendar/create-event', eventData);
    return data;
  },

  listCalendarEvents: async (maxResults: number = 10) => {
    const { data } = await api.get(`/google-calendar/events?maxResults=${maxResults}`);
    return data;
  },

  // Google Contacts
  createContact: async (contactData: any) => {
    const { data } = await api.post('/google-contacts/create', contactData);
    return data;
  },

  getGoogleContactsAuthUrl: () => {
    const baseURL = api.defaults.baseURL || 'http://localhost:5001';
    return `${baseURL}/google-contacts/oauth/login`;
  },

  handleGoogleContactsCallback: async (code: string) => {
    const { data } = await api.get(`/google-contacts/oauth/callback?code=${code}`);
    return data;
  },

  // Email
  sendEmail: async (emailData: any) => {
    const { data } = await api.post('/email/send', emailData);
    return data;
  }
};
