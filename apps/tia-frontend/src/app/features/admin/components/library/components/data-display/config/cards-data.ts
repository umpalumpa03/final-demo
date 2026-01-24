import { StatisticCardData } from '../../../../../../../shared/lib/cards/models/card.model';

export const STATISTICS_CARDS_DATA: StatisticCardData[] = [
  {
    label: 'Total Users',
    value: '1,234',
    change: '+12% from last month',
    changeType: 'positive',
    icon: 'images/svg/cards/person.svg',
  },
  {
    label: 'Active Sessions',
    value: '456',
    change: '+8% from last hour',
    changeType: 'positive',
    icon: 'images/svg/cards/vector.svg',
  },
  {
    label: 'Revenue',
    value: '$12.5K',
    change: '-3% from last week',
    changeType: 'negative',
    icon: 'images/svg/cards/dolar.svg',
  },
  {
    label: 'Conversion',
    value: '3.2%',
    change: 'No change',
    changeType: 'positive',
    icon: 'images/svg/cards/card.svg',
  },
];
