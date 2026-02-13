import { TranslateService } from '@ngx-translate/core';
import { NavItemLibrary } from '../interfaces/item.model';

export const getNavItems = (translate: TranslateService): NavItemLibrary[] => [
  { label: translate.instant('storybook.overlays.leftSheet.items.profile'), icon: 'profile' },
  { label: translate.instant('storybook.overlays.leftSheet.items.settings'), icon: 'settings' },
  { label: translate.instant('storybook.overlays.leftSheet.items.messages'), icon: 'messages' },
  { label: translate.instant('storybook.overlays.leftSheet.items.logout'), icon: 'logout' },
];
