/**
 * Environment configuration
 * Centralized configuration for environment variables
 */

export const ENV = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AREA',

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',

  // Development flags
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',

  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
  },
} as const;

export default ENV;
