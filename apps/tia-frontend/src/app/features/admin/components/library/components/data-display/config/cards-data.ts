import { StatisticCardData } from '../../../../../../../shared/lib/cards/models/card.model';

export const STATISTICS_CARDS_DATA: StatisticCardData[] = [
  {
    id: 'basic-card-1',
    label: 'Total Users',
    value: '1,234',
    change: '+12% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/person.svg',
  },
  {
    id: 'basic-card-2',
    label: 'Active Sessions',
    value: '456',
    change: '+8% from last hour',
    changeType: 'positive',
    icon: 'images/svg/cards/vector.svg',
  },
  {
    id: 'basic-card-3',
    label: 'Revenue',
    value: '$12.5K',
    change: '-3% from last week',
    changeType: 'negative',
    icon: 'images/svg/cards/dolar.svg',
  },
  {
    id: 'basic-card-4',
    label: 'Conversion',
    value: '3.2%',
    change: 'No change',
    changeType: 'positive',
    icon: 'images/svg/cards/card.svg',
  },
];
