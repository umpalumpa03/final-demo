export const LOAN_ICONS = {
  default: '/images/svg/feature-loans/default.svg',
  approve: '/images/svg/feature-loans/approve.svg',
  pending: '/images/svg/feature-loans/pending.svg',
  declined: '/images/svg/feature-loans/declined.svg',
} as const;

export const LOAN_UI_CONFIG = {
  1: { badge: 'badge--pending', color: 'yellow', iconKey: 'pending' },
  2: { badge: 'badge--approved', color: 'green', iconKey: 'approve' },
  3: { badge: 'badge--declined', color: 'red', iconKey: 'declined' },
} as const;

export const DEFAULT_UI_CONFIG = {
  badge: 'badge--gray',
  color: 'blue',
  iconKey: 'default' as keyof typeof LOAN_ICONS,
} as const;
