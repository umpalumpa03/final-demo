export const widgetItems = [
  {
    id: '1',
    title: 'Recent Transactions',
    subtitle: 'Your latest account activity',
    icon: 'images/svg/dashboard/transactions.svg',
    type: 'transactions',
    hasPagination: true,
  },
  {
    id: '2',
    title: 'Accounts',
    subtitle: 'Your account balances and activity',
    icon: 'images/svg/dashboard/accounts.svg',
    type: 'accounts',
    hasAdd: true,
  },
  {
    id: '3',
    title: 'Exchange Rates',
    subtitle: 'Live currency exchange rates',
    icon: 'images/svg/dashboard/rates.svg',
    type: 'exchange',
    hasButton: true,
  },

] as const;
