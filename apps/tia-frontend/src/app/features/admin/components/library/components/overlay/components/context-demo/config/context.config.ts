import { ContextMenuItem } from '../../../../../../../../../shared/lib/overlay/ui-context/models/context.model';

export const menuItems: (ContextMenuItem | 'divider')[] = [
  { label: 'Copy', icon: 'copy', action: 'copy' },
  { label: 'Edit', icon: 'edit', action: 'edit' },
  { label: 'New', icon: 'new', action: 'new' },
  'divider',
  { label: 'Show Grid', icon: 'grid', action: 'grid' },
  { label: 'Show Rulers', icon: 'ruler', action: 'ruler' },
  'divider',
  { label: 'Delete', icon: 'delete', action: 'delete', variant: 'danger' },
] as const;
