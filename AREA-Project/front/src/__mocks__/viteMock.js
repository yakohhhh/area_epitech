// Mock for Vite's import.meta
global.importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:5001',
    VITE_SENTRY_DSN: '',
    NODE_ENV: 'test',
    MODE: 'test',
    DEV: false,
    PROD: false,
  },
};

// Mock import.meta for Jest
Object.defineProperty(global, 'import', {
  value: {
    meta: global.importMeta,
  },
  writable: true,
});
