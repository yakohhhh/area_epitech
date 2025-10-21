import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // Safely get environment variables
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  // Only initialize Sentry in production or if DSN is provided
  if (isProduction || sentryDsn) {
    try {
      Sentry.init({
        dsn: sentryDsn,
        environment: isDevelopment ? 'development' : 'production',
        release: '1.0.0',
        integrations: [
          new Sentry.BrowserTracing({
            // Set tracing origins to connect sentry for performance monitoring
            tracePropagationTargets: [
              'localhost',
              /^https:\/\/yourapi\.domain\.com\/api/,
            ],
          }),
          new Sentry.Replay({
            // Capture sessions based on environment
            sessionSampleRate: isProduction ? 0.1 : 1.0,
            // Capture 100% of sessions with an error
            errorSampleRate: 1.0,
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: isProduction ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
        replaysOnErrorSampleRate: 1.0,

        beforeSend(event, hint) {
          // Filter out localhost errors in development
          if (isDevelopment) {
            const error = hint.originalException as Error;
            if (error?.message?.includes('localhost')) {
              return null;
            }
          }
          return event;
        },
      });
    } catch (error) {
      // Silently fail in development
      if (isDevelopment) {
        console.warn('Failed to initialize Sentry:', error);
      }
    }
  }
};

export { Sentry };
