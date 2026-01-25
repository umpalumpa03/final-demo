import { ListDisplayItem } from '../../../../../shared/lib/data-display/models/list-display.models';

export const LIST_DISPLAY_ITEMS: ListDisplayItem[] = [
  {
    id: 'user-1',
    initials: 'JD',
    name: 'John Doe',
    role: 'Admin',
    statusTone: 'green',
    badge: { label: 'Admin', tone: 'blue' },
  },
  {
    id: 'user-2',
    initials: 'JS',
    name: 'Jane Smith',
    role: 'Editor',
    statusTone: 'orange',
    badge: { label: 'Editor', tone: 'blue' },
  },
  {
    id: 'user-3',
    initials: 'BJ',
    name: 'Bob Johnson',
    role: 'User',
    statusTone: 'gray',
    badge: { label: 'User', tone: 'gray' },
  },
  {
    id: 'user-4',
    initials: 'AB',
    name: 'Alice Brown',
    role: 'User',
    statusTone: 'green',
    badge: { label: 'User', tone: 'gray' },
  },
];
