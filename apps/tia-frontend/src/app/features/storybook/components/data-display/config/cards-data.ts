import { TranslateService } from '@ngx-translate/core';
import { StatisticCardData } from '../../../../../shared/lib/cards/models/card.model';

export const getStatisticsCardsData = (translate: TranslateService): StatisticCardData[] => [
  {
    id: 'basic-card-1',
    label: translate.instant('storybook.data-display.sections.cards.items.totalUsersLabel'),
    value: translate.instant('storybook.data-display.sections.cards.items.totalUsersValue'),
    change: translate.instant('storybook.data-display.sections.cards.items.totalUsersChange'),
    changeType: 'positive',
    icon: 'images/svg/cards/person.svg',
  },
  {
    id: 'basic-card-2',
    label: translate.instant('storybook.data-display.sections.cards.items.activeSessionsLabel'),
    value: translate.instant('storybook.data-display.sections.cards.items.activeSessionsValue'),
    change: translate.instant('storybook.data-display.sections.cards.items.activeSessionsChange'),
    changeType: 'positive',
    icon: 'images/svg/cards/vector.svg',
  },
  {
    id: 'basic-card-3',
    label: translate.instant('storybook.data-display.sections.cards.items.revenueLabel'),
    value: translate.instant('storybook.data-display.sections.cards.items.revenueValue'),
    change: translate.instant('storybook.data-display.sections.cards.items.revenueChange'),
    changeType: 'negative',
    icon: 'images/svg/cards/dolar.svg',
  },
  {
    id: 'basic-card-4',
    label: translate.instant('storybook.data-display.sections.cards.items.conversionLabel'),
    value: translate.instant('storybook.data-display.sections.cards.items.conversionValue'),
    change: translate.instant('storybook.data-display.sections.cards.items.conversionChange'),
    changeType: 'positive',
    icon: 'images/svg/cards/card.svg',
  },
];
