import { TranslateService } from '@ngx-translate/core';
import { KeyValueDisplayItem } from '../../../../../shared/lib/data-display/models/key-value-display.models';

export const getKeyValueTitle = (translate: TranslateService): string =>
  translate.instant('storybook.data-display.sections.keyValueDisplay.userInfo');

export const getKeyValueItems = (translate: TranslateService): KeyValueDisplayItem[] => [
  {
    id: 'full-name',
    label: translate.instant('storybook.data-display.sections.keyValueDisplay.items.fullNameLabel'),
    value: translate.instant('storybook.data-display.sections.keyValueDisplay.items.fullNameValue'),
  },
  {
    id: 'email',
    label: translate.instant('storybook.data-display.sections.keyValueDisplay.items.emailLabel'),
    value: translate.instant('storybook.data-display.sections.keyValueDisplay.items.emailValue'),
  },
  {
    id: 'role',
    label: translate.instant('storybook.data-display.sections.keyValueDisplay.items.roleLabel'),
    value: translate.instant('storybook.data-display.sections.keyValueDisplay.items.roleValue'),
    valueType: 'badge',
    badgeTone: 'blue',
  },
  {
    id: 'status',
    label: translate.instant('storybook.data-display.sections.keyValueDisplay.items.statusLabel'),
    value: translate.instant('storybook.data-display.sections.keyValueDisplay.items.statusValue'),
    valueType: 'badge',
    badgeTone: 'green',
  },
  {
    id: 'member',
    label: translate.instant('storybook.data-display.sections.keyValueDisplay.items.memberLabel'),
    value: translate.instant('storybook.data-display.sections.keyValueDisplay.items.memberValue'),
  },
];
