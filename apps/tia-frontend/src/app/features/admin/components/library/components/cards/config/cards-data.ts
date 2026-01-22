import { CardData, StatisticCardData } from 'apps/tia-frontend/src/app/shared/lib/cards/models/card.model';

export const BASIC_CARDS_DATA: CardData[] = [
  {
    title: 'Card Title',
    subtitle: 'Card description goes here',
    content: 'This is the main content area of the card. You can put any content here.',
  },
  {
    title: 'Hover Effect',
    subtitle: 'Hover over this card',
    content: 'This card has hover effects applied.',
  },
];

export const STATISTICS_CARDS_DATA: StatisticCardData[] = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/dolar.svg',
  },
  {
    label: 'Subscriptions',
    value: '+2,350',
    change: '+180.1% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/person.svg',
  },
  {
    label: 'Sales',
    value: '+12,234',
    change: '+19% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/card.svg',
  },
  {
    label: 'Active Now',
    value: '+573',
    change: '-4% from last hour',
    changeType: 'negative',
    icon: 'images/svg/cards/vector.svg',
  },
];