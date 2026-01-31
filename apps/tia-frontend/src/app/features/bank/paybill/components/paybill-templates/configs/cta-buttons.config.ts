import { TranslateService } from '@ngx-translate/core';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';
interface Buttons {
  id: number;
  variant: ButtonVariant;
  text: string;
  action: string;
}

export const ctaButtonConfig = (translate: TranslateService): Buttons[] => [
  {
    id: 1,
    variant: 'outline',
    text: translate.instant('paybill.templates.selectButton'),
    action: 'select',
  },
  {
    id: 2,
    variant: 'outline',
    text: translate.instant('paybill.templates.createTemplate'),
    action: 'template',
  },
  {
    id: 3,
    variant: 'default',
    text: translate.instant('paybill.templates.createGroup'),
    action: 'group',
  },
];
