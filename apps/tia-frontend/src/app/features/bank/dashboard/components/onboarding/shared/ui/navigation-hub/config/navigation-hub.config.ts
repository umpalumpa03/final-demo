import { NavigationHubItem } from '../models/navigation-hub.model';

export const NAVIGATION_HUB_ITEMS: NavigationHubItem[] = [
  {
    icon: 'images/svg/onboarding/dashboard.svg',
    title: 'Dashboard',
    description: 'Your financial overview and widgets',
  },
  {
    icon: 'images/svg/onboarding/products.svg',
    title: 'My Products',
    description: 'Manage accounts, cards, and view 3D card designs',
  },
  {
    icon: 'images/svg/onboarding/transactions.svg',
    title: 'Transactions',
    description: 'View and filter all your transaction history',
  },
  {
    icon: 'images/svg/onboarding/transfers.svg',
    title: 'Transfers',
    description: 'Send money between accounts and to others',
  },
  {
    icon: 'images/svg/onboarding/loans.svg',
    title: 'Loans',
    description: 'Apply for and manage your loans',
  },
  {
    icon: 'images/svg/onboarding/finances.svg',
    title: 'My Finances',
    description: 'Track income, expenses, and savings with charts',
  },
  {
    icon: 'images/svg/onboarding/paybill.svg',
    title: 'Paybill',
    description: 'Pay bills, create templates, and manage groups',
  },
  {
    icon: 'images/svg/onboarding/settings.svg',
    title: 'Settings',
    description: 'Customize your profile and preferences',
  },
] as const;
