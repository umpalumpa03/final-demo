import {
  ButtonVariant,
  ButtonSize,
} from '../../../../../shared/lib/primitives/button/button.model';
import { ButtonDemoItem } from '../models/button-demo.model';

export const BUTTON_VARIANTS: ButtonVariant[] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
] as const;

export const BUTTON_SIZES: ButtonSize[] = ['small', 'default', 'large'];

export const STATE_EXAMPLES: { disabled: ButtonDemoItem[] } = {
  disabled: [
    { variant: 'default', label: 'Disabled Button' },
    { variant: 'secondary', label: 'Disabled Secondary' },
  ],
} as const;

export const ICON_BUTTONS: ButtonDemoItem[] = [
  {
    variant: 'default',
    label: 'Send Email',
    icon: 'email-icon.svg',
  },
  {
    variant: 'secondary',
    label: 'Download',
    icon: 'download-icon.svg',
  },
  {
    variant: 'destructive',
    label: 'Delete',
    icon: 'trash-icon.svg',
  },
  {
    variant: 'outline',
    label: 'Confirm',
    icon: 'confirm-icon.svg',
  },
  {
    variant: 'default',
    label: 'Add New',
    icon: 'plus-icon.svg',
  },
  {
    variant: 'ghost',
    label: 'Settings',
    icon: 'set-arrow.svg',
  },
] as const;

export const ICON_ONLY_BUTTONS: ButtonDemoItem[] = [
  {
    variant: 'default',
    label: 'Add new item',
    icon: 'plus-icon.svg',
  },
  {
    variant: 'outline',
    label: 'Open settings',
    icon: 'set-icon.svg',
  },
  {
    variant: 'secondary',
    label: 'Download',
    icon: 'download-icon.svg',
  },
  {
    variant: 'ghost',
    label: 'Inbox',
    icon: 'white-email-icon.svg',
  },
  {
    variant: 'destructive',
    label: 'Delete',
    icon: 'trash-icon.svg',
  },
] as const;

export const INTERACTIVE_EXAMPLES: ButtonDemoItem[] = [
  {
    variant: 'outline',
    label: 'Like (42)',
    icon: 'hearth-icon.svg',
  },
  {
    variant: 'default',
    label: 'Download File',
    icon: 'white-download.svg',
  },
] as const;

export const BUTTON_GROUPS = {
  simple: {
    count: 3,
    labels: ['Left', 'Center', 'Right']
  },
  withActions: [
    { 
      label: 'Save', 
      action: () => console.log('Save Function Example Runs!') 
    },
    { 
      label: 'Delete', 
      action: () => alert('Delete Function Example Runs!') 
    }
  ],
  withNavigation: [
    { label: 'Home', routerLink: '/home' },
    { label: 'Profile', routerLink: '/profile' },
    { label: 'Settings', routerLink: '/settings' }
  ]
} as const;