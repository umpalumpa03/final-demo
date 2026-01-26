import { ButtonGroupItem } from '@tia/shared/lib/primitives/button-group/button-group.models/button-group.models';

export const navConfig: ButtonGroupItem[] = [
  { label: 'Pay Bill', routerLink: './' },
  { label: 'Templates', routerLink: 'templates' },
] as const;
