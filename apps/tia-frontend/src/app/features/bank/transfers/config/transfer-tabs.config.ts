import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';

export const TRANSFERTABS = [
  { label: 'Between Own Accounts', route: 'internal' },
  { label: 'To Other Account', route: 'external' },
] as const satisfies readonly TabItem[];
