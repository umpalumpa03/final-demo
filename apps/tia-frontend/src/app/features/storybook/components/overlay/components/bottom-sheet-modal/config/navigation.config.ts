import { TranslateService } from '@ngx-translate/core';

export const getQuickActions = (translate: TranslateService) => [
  { label: translate.instant('storybook.overlays.bottomSheet.actions.new'), icon: 'add' },
  { label: translate.instant('storybook.overlays.bottomSheet.actions.edit'), icon: 'edit' },
  { label: translate.instant('storybook.overlays.bottomSheet.actions.copy'), icon: 'copy' },
  { label: translate.instant('storybook.overlays.bottomSheet.actions.delete'), icon: 'delete' },
];
