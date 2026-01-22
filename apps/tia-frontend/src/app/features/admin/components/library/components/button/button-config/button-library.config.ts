import {ButtonVariant,ButtonSize} from '../../../../../../../shared/lib/primitives/button/button.model';

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
  { variant: 'default' as ButtonVariant, icon: '✉', label: 'Send Email' },
  { variant: 'secondary' as ButtonVariant, icon: '↓', label: 'Download' },
  { variant: 'destructive' as ButtonVariant, icon: '🗑', label: 'Delete' },
  { variant: 'outline' as ButtonVariant, icon: '✓', label: 'Confirm' },
];

export const ICON_ONLY_BUTTONS = [
  { variant: 'default' as ButtonVariant, icon: '+' },
  { variant: 'outline' as ButtonVariant, icon: '⚙' },
  { variant: 'secondary' as ButtonVariant, icon: '📥' },
  { variant: 'ghost' as ButtonVariant, icon: '✉' },
  { variant: 'destructive' as ButtonVariant, icon: '🗑' }
];
