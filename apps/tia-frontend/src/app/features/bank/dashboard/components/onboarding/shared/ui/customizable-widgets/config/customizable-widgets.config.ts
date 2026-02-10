import { WidgetItem } from '../models/customizable-widgets.model';

export const WIDGET_ITEMS: WidgetItem[] = [
  {
    title: 'Recent Transactions',
    description:
      'View your latest transactions with details. Adjust display count (5-20) and use the repeat button for quick re-payments.',
    color: 'green',
  },
  {
    title: 'Accounts Overview',
    description:
      'Monitor all account balances, see recent changes, hide/show balances with the eye icon, and add new accounts.',
    color: 'green',
  },
  {
    title: 'Live Exchange Rates',
    description:
      'Stay updated with real-time currency and cryptocurrency values. Click refresh for the latest market data.',
    color: 'green',
  },
  {
    title: 'Pro Tip: Grab any widget by the grip icon (⠿) and drag to reorder!',
    description: '',
    color: 'yellow',
  },
] as const;
