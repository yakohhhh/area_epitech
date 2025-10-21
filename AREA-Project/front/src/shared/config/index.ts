export { default as ENV } from './env';
export * from './env';

/**
 * Application configuration (legacy - will be deprecated)
 */
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
    timeout: 10000,
  },
  app: {
    name: 'AREA',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  features: {
    enableSentry: import.meta.env.VITE_ENABLE_SENTRY === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
} as const;
