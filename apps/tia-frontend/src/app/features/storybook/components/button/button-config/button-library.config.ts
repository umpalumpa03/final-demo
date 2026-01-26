import {
  ButtonVariant,
  ButtonSize,
} from '../../../../../shared/lib/primitives/button/button.model';

export const BUTTON_VARIANTS: ButtonVariant[] = [
  'default',
  'secondary',
  'destructive',
  'outline',
  'ghost',
  'link',
];

export const BUTTON_SIZES: ButtonSize[] = ['small', 'default', 'large'];

export const STATE_EXAMPLES = {
  disabled: [
    { variant: 'default' as ButtonVariant, label: 'Disabled Button' },
    { variant: 'secondary' as ButtonVariant, label: 'Disabled Secondary' },
  ],
};

export const ICON_BUTTONS = [
  {
    variant: 'default' as ButtonVariant,
    label: 'Send Email',
    icon: 'email-icon.svg',
  },
  {
    variant: 'secondary' as ButtonVariant,
    label: 'Download',
    icon: 'download-icon.svg',
  },
  {
    variant: 'destructive' as ButtonVariant,
    label: 'Delete',
    icon: 'trash-icon.svg',
  },
  {
    variant: 'outline' as ButtonVariant,
    label: 'Confirm',
    icon: 'confirm-icon.svg',
  },
  {
    variant: 'default' as ButtonVariant,
    label: 'Add New',
    icon: 'plus-icon.svg',
  },
  {
    variant: 'ghost' as ButtonVariant,
    label: 'Settings',
    icon: 'set-arrow.svg',
  },
];

export const ICON_ONLY_BUTTONS = [
  {
    variant: 'default' as ButtonVariant,
    label: 'Add new item',
    icon: 'plus-icon.svg',
  },
  {
    variant: 'outline' as ButtonVariant,
    label: 'Open settings',
    icon: 'set-icon.svg',
  },
  {
    variant: 'secondary' as ButtonVariant,
    label: 'Download',
    icon: 'download-icon.svg',
  },
  {
    variant: 'ghost' as ButtonVariant,
    label: 'Inbox',
    icon: 'white-email-icon.svg',
  },
  {
    variant: 'destructive' as ButtonVariant,
    label: 'Delete',
    icon: 'trash-icon.svg',
  },
];

export const INTERACTIVE_EXAMPLES = [
  {
    variant: 'outline' as ButtonVariant,
    label: 'Like (42)',
    icon: 'hearth-icon.svg',
  },
  {
    variant: 'default' as ButtonVariant,
    label: 'Download File',
    icon: 'white-download.svg',
  },
];


export const BUTTON_GROUPS = {
  simple: {
    count: 3,
    labels: ['Left', 'Center', 'Right'] // static texts
  },

  withActions: [
    { 
      label: 'Save', 
      action: () => console.log('Save Function Example Runs!') // function binding on groups
    },
    { 
      label: 'Delete', 
      action: () => alert('Delete Function Example Runs!') 
    }
  ],

  withNavigation: [
    { 
      label: 'Home', 
      routerLink: '/home' 
    },
    { 
      label: 'Profile', 
      routerLink: '/profile'   // navigation binding on button groups
    },
    { 
      label: 'Settings', 
      routerLink: '/settings' 
    }
  ]
};