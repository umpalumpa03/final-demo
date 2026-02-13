import { TranslateService } from '@ngx-translate/core';
import { CommandAction } from '../../../../../../../shared/lib/overlay/ui-command-palette/models/palette.model';

export const getCommandActions = (translate: TranslateService): CommandAction[] => [
  { id: '1', label: translate.instant('storybook.overlays.commandPaletteActions.viewProfile'), icon: 'user', isSuggestion: true },
  { id: '2', label: translate.instant('storybook.overlays.commandPaletteActions.settings'), icon: 'settings', isSuggestion: true },
  { id: '3', label: translate.instant('storybook.overlays.commandPaletteActions.messages'), icon: 'mail', isSuggestion: true },
  { id: '4', label: translate.instant('storybook.overlays.commandPaletteActions.createNew'), icon: 'plus' },
  { id: '5', label: translate.instant('storybook.overlays.commandPaletteActions.copyLink'), icon: 'copy' },
];
