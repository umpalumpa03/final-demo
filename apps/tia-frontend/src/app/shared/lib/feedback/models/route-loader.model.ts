export const RouteLoaderVariants = {
  TopBar: 'top-bar',
  FullPage: 'full-page',
  Pulsing: 'pulsing'
} as const;

export type RouteLoaderVariant = typeof RouteLoaderVariants[keyof typeof RouteLoaderVariants];
