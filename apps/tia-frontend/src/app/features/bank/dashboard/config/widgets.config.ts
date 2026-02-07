import { bannerSlides } from './banners.config';

export const widgetItems = [
  {
    id: '1',
    title: 'dashboard.widgets.transactions.title',
    subtitle: 'dashboard.widgets.transactions.subtitle',
    icon: 'images/svg/dashboard/transactions.svg',
    type: 'transactions',
    hasPagination: true,
  },
  {
    id: '2',
    title: 'dashboard.widgets.accounts.title',
    subtitle: 'dashboard.widgets.accounts.subtitle',
    icon: 'images/svg/dashboard/accounts.svg',
    type: 'accounts',
    hasAdd: true,
  },
  {
    id: '3',
    title: 'dashboard.widgets.exchange.title',
    subtitle: 'dashboard.widgets.exchange.subtitle',
    icon: 'images/svg/dashboard/rates.svg',
    type: 'exchange',
    hasButton: true,
  },
] as const;

export const catalog = [
  {
    id: 'transactions',
    title: 'Recent Transactions',
    subtitle: 'dashboard.widgets.transactions.desc',
    type: 'transactions',
  },
  {
    id: 'accounts',
    title: 'Accounts',
    subtitle: 'dashboard.widgets.accounts.desc',
    type: 'accounts',
  },
  {
    id: 'exchange',
    title: 'Currency Exchange',
    subtitle: 'dashboard.widgets.exchange.desc',
    type: 'exchange',
  },
] as const;

export const DASHBOARD_CONFIG = {
  GRID_COLUMNS: { default: 2, md: 0, sm: 0 },
  BANNER_SLIDES: bannerSlides,
  WIDGET_CATALOG: catalog,
  PERSISTENCE_DEBOUNCE: 1000,
} as const;
