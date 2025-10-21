/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend process.env for development
declare global {
  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }
}
