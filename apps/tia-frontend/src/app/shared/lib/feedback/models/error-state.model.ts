export const ErrorStateVariants = {
  Failed: 'failed',
  NotFound: 'not-found',
  ConnectionError: 'connection-error',
} as const;

export type ErrorStateVariant = typeof ErrorStateVariants[keyof typeof ErrorStateVariants];
