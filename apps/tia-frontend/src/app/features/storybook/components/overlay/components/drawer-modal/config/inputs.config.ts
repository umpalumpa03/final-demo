import { TranslateService } from '@ngx-translate/core';

export const getNameConfig = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.drawer.nameLabel'),
  placeholder: translate.instant('storybook.overlays.drawer.namePlaceholder'),
});

export const getEmailConfig = (translate: TranslateService) => ({
  label: translate.instant('storybook.overlays.drawer.emailLabel'),
  placeholder: translate.instant('storybook.overlays.drawer.emailPlaceholder'),
  type: 'email',
});
