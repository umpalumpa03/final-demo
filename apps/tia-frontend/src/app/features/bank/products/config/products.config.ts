import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { TranslateService } from '@ngx-translate/core';

export const getProductTabs = (translate: TranslateService): TabItem[] => [
  { label: translate.instant('my-products.tabs.accounts'), route: 'accounts' },
  { label: translate.instant('my-products.tabs.cards'), route: 'cards/list' },
];
