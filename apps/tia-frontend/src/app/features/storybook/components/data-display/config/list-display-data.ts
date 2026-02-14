import { TranslateService } from '@ngx-translate/core';
import { ListDisplayItem } from '../../../../../shared/lib/data-display/models/list-display.models';

export const getListDisplayItems = (translate: TranslateService): ListDisplayItem[] => [
  {
    id: 'user-1',
    initials: 'JD',
    name: translate.instant('storybook.data-display.sections.listDisplay.items.johnName'),
    role: translate.instant('storybook.data-display.sections.listDisplay.items.johnRole'),
    statusTone: 'green',
    badge: {
      label: translate.instant('storybook.data-display.sections.listDisplay.items.johnBadge'),
      tone: 'blue',
    },
  },
  {
    id: 'user-2',
    initials: 'JS',
    name: translate.instant('storybook.data-display.sections.listDisplay.items.janeName'),
    role: translate.instant('storybook.data-display.sections.listDisplay.items.janeRole'),
    statusTone: 'orange',
    badge: {
      label: translate.instant('storybook.data-display.sections.listDisplay.items.janeBadge'),
      tone: 'blue',
    },
  },
  {
    id: 'user-3',
    initials: 'BJ',
    name: translate.instant('storybook.data-display.sections.listDisplay.items.bobName'),
    role: translate.instant('storybook.data-display.sections.listDisplay.items.bobRole'),
    statusTone: 'gray',
    badge: {
      label: translate.instant('storybook.data-display.sections.listDisplay.items.bobBadge'),
      tone: 'gray',
    },
  },
  {
    id: 'user-4',
    initials: 'AB',
    name: translate.instant('storybook.data-display.sections.listDisplay.items.aliceName'),
    role: translate.instant('storybook.data-display.sections.listDisplay.items.aliceRole'),
    statusTone: 'green',
    badge: {
      label: translate.instant('storybook.data-display.sections.listDisplay.items.aliceBadge'),
      tone: 'gray',
    },
  },
];
