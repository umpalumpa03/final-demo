import { CommandAction } from '../../../../../../../../../shared/lib/overlay/ui-command-palette/models/palette.model';

export const myCommandActions: CommandAction[] = [
  { id: '1', label: 'View Profile', icon: 'user', isSuggestion: true },
  { id: '2', label: 'Settings', icon: 'settings', isSuggestion: true },
  { id: '3', label: 'Messages', icon: 'mail', isSuggestion: true },
  { id: '4', label: 'Create New', icon: 'plus' },
  { id: '5', label: 'Copy Link', icon: 'copy' },
] as const;
