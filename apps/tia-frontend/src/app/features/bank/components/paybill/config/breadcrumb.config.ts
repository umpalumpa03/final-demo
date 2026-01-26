import { Breadcrumb } from '@tia/shared/lib/navigation/models/breadcrumbs.model';

export const BREADCRUMBS_PAAYBILL: Breadcrumb[] = [
  { label: 'Paybill', route: '/bank/paybill' },
  { label: 'Products', route: 'test' },
  { label: 'Current Page', route: '' },
] as const;
