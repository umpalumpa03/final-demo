import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { TranslateService } from '@ngx-translate/core';

export const getTransferTabs = (translate: TranslateService): TabItem[] => [
  {
    label: translate.instant('transfers.types.internal'),
    route: 'internal',
    icon: 'images/svg/transfers/internal-icon.svg',
  },
  {
    label: translate.instant('transfers.types.external'),
    route: 'external',
    icon: 'images/svg/transfers/external-icon.svg',
  },
];
