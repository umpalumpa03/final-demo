import { TranslateService } from '@ngx-translate/core';

export type HoverCardTriggerVariant = 'link' | 'button';

export interface HoverCardItem {
  handle: string;
  initials: string;
  name: string;
  role: string;
  detail: string;
  variant: HoverCardTriggerVariant;
}

export const getHoverCardItems = (translate: TranslateService): HoverCardItem[] => [
  {
    handle: translate.instant('storybook.data-display.sections.hoverCards.items.johndoeHandle'),
    initials: 'JD',
    name: translate.instant('storybook.data-display.sections.hoverCards.items.johndoeName'),
    role: translate.instant('storybook.data-display.sections.hoverCards.items.johndoeRole'),
    detail: translate.instant('storybook.data-display.sections.hoverCards.items.johndoeDetail'),
    variant: 'link',
  },
  {
    handle: translate.instant('storybook.data-display.sections.hoverCards.items.janedoeHandle'),
    initials: 'JA',
    name: translate.instant('storybook.data-display.sections.hoverCards.items.janedoeName'),
    role: translate.instant('storybook.data-display.sections.hoverCards.items.janedoeRole'),
    detail: translate.instant('storybook.data-display.sections.hoverCards.items.janedoeDetail'),
    variant: 'link',
  },
  {
    handle: translate.instant('storybook.data-display.sections.hoverCards.items.alexHandle'),
    initials: 'AD',
    name: translate.instant('storybook.data-display.sections.hoverCards.items.alexName'),
    role: translate.instant('storybook.data-display.sections.hoverCards.items.alexRole'),
    detail: translate.instant('storybook.data-display.sections.hoverCards.items.alexDetail'),
    variant: 'button',
  },
];
