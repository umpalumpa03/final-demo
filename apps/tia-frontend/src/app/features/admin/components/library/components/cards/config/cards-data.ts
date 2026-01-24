import {
  CardData,
  StatisticCardData,
} from 'apps/tia-frontend/src/app/shared/lib/cards/models/card.model';

export const BASIC_CARDS_DATA: CardData[] = [
  {
    id: 'basic-card-1',
    title: 'Card Title',
    subtitle: 'Card description goes here',
    content:
      'This is the main content area of the card. You can put any content here.',
  },
  {
    id: 'basic-card-2',
    title: 'With Footer',
    subtitle: 'Card with action buttons',
    content: 'This card includes a footer with action buttons.',
    hasFooter: true,
  },
  {
    id: 'basic-card-3',
    title: 'Hover Effect',
    subtitle: 'Hover over this card',
    content: 'This card has hover effects applied.',
     hasHover: true,
  },
] as const;

export const STATISTICS_CARDS_DATA: StatisticCardData[] = [
  {
    id: 'stat-card-revenue',
    label: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/dolar.svg',
  },
  {
    id: 'stat-card-subscriptions',
    label: 'Subscriptions',
    value: '+2,350',
    change: '+180.1% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/person.svg',
  },
  {
    id: 'stat-card-sales',
    label: 'Sales',
    value: '+12,234',
    change: '+19% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/card.svg',
  },
  {
    id: 'stat-card-active',
    label: 'Active Now',
    value: '+573',
    change: '-4% from last hour',
    changeType: 'negative',
    icon: 'images/svg/cards/vector.svg',
  },
] as const;