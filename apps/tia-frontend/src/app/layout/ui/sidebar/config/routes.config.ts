import { NavigationItem } from '@tia/shared/lib/navigation/models/nav-bar.model';
import { TranslateService } from '@ngx-translate/core';

export const getSidebarItems = (
  translate: TranslateService,
): NavigationItem[] => [
  {
    label: translate.instant('sidebar.sidebar.dashboard'),
    icon: 'images/svg/sidebar-nav/dashboard.svg',
    route: 'dashboard',
  },
  {
    label: translate.instant('sidebar.sidebar.products'),
    icon: 'images/svg/sidebar-nav/products.svg',
    route: 'products',
  },
  {
    label: translate.instant('sidebar.sidebar.transactions'),
    icon: 'images/svg/sidebar-nav/transactions.svg',
    route: 'transactions',
  },
  {
    label: translate.instant('sidebar.sidebar.transfers'),
    icon: 'images/svg/sidebar-nav/transfers.svg',
    route: 'transfers',
  },
  {
    label: translate.instant('sidebar.sidebar.loans'),
    icon: 'images/svg/sidebar-nav/loans.svg',
    route: 'loans',
  },
  {
    label: translate.instant('sidebar.sidebar.finances'),
    icon: 'images/svg/sidebar-nav/finances.svg',
    route: 'finances',
  },
  {
    label: translate.instant('sidebar.sidebar.paybill'),
    icon: 'images/svg/sidebar-nav/paybill.svg',
    route: 'paybill',
  },
  {
    label: translate.instant('sidebar.sidebar.settings'),
    icon: 'images/svg/sidebar-nav/settings.svg',
    route: 'settings',
  },
];
