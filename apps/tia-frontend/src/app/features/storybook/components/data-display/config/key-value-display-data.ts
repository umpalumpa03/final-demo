import { KeyValueDisplayItem } from '../../../../../shared/lib/data-display/models/key-value-display.models';

export const KEY_VALUE_TITLE = 'User Information';

export const KEY_VALUE_ITEMS: KeyValueDisplayItem[] = [
  { id: 'full-name', label: 'Full Name:', value: 'John Doe' },
  { id: 'email', label: 'Email:', value: 'john@example.com' },
  {
    id: 'role',
    label: 'Role:',
    value: 'Administrator',
    valueType: 'badge',
    badgeTone: 'blue',
  },
  {
    id: 'status',
    label: 'Status:',
    value: 'Active',
    valueType: 'badge',
    badgeTone: 'green',
  },
  { id: 'member', label: 'Member Since:', value: 'Jan 2024' },
];
