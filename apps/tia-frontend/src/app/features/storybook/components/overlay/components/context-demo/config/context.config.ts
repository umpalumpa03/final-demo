import { TranslateService } from '@ngx-translate/core';
import { ContextMenuItem } from '../../../../../../../shared/lib/overlay/ui-context/models/context.model';

export const getMenuItems = (translate: TranslateService): (ContextMenuItem | 'divider')[] => [
  { label: translate.instant('storybook.overlays.contextMenu.items.copy'), icon: 'copy', action: 'copy' },
  { label: translate.instant('storybook.overlays.contextMenu.items.edit'), icon: 'edit', action: 'edit' },
  { label: translate.instant('storybook.overlays.contextMenu.items.new'), icon: 'new', action: 'new' },
  'divider',
  { label: translate.instant('storybook.overlays.contextMenu.items.showGrid'), icon: 'grid', action: 'grid' },
  { label: translate.instant('storybook.overlays.contextMenu.items.showRulers'), icon: 'ruler', action: 'ruler' },
  'divider',
  { label: translate.instant('storybook.overlays.contextMenu.items.delete'), icon: 'delete', action: 'delete', variant: 'danger' },
];
