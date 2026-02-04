import { EditSelectConfig } from '../models/user-edit.model';

export const USER_ROLE: EditSelectConfig = {
  config: {
    label: 'Role',
    placeholder: 'Choose a role...',
  },
  options: [
    { label: 'Consumer', value: 'CONSUMER' },
    { label: 'Support', value: 'SUPPORT' },
  ],
  initialValue: '1',
} as const;
