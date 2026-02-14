import { WidgetItem } from '../models/customizable-widgets.model';

export const WIDGET_ITEMS: WidgetItem[] = [
  {
    title: 'dashboard.onboarding.customizable-widgets.transactions.title',
    description:
      'dashboard.onboarding.customizable-widgets.transactions.description',
    color: 'green',
  },
  {
    title: 'dashboard.onboarding.customizable-widgets.accounts.title',
    description:
      'dashboard.onboarding.customizable-widgets.accounts.description',
    color: 'green',
  },
  {
    title: 'dashboard.onboarding.customizable-widgets.exchange.title',
    description:
      'dashboard.onboarding.customizable-widgets.exchange.description',
    color: 'green',
  },
  {
    title: 'dashboard.onboarding.customizable-widgets.pro-tip.title',
    description:
      'dashboard.onboarding.customizable-widgets.pro-tip.description',
    color: 'yellow',
  },
] as const;
