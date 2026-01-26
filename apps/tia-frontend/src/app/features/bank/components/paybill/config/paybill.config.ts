import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';

export const navConfig: TabItem[] = [
  { label: 'Paybill', icon: 'images/svg/paybill/elva.svg', route: './' },
  {
    label: 'Templates',
    icon: 'images/svg/paybill/star.svg',
    route: './templates',
  },
] as const;
