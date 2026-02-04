import { TranslateService } from '@ngx-translate/core';
import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';

export const navConfig = (translate: TranslateService): TabItem[] =>
  [
    {
      label: translate.instant('paybill.shared.navigation.label1'),
      icon: 'images/svg/paybill/elva.svg',
      route: 'pay',
    },
    {
      label: translate.instant('paybill.shared.navigation.label2'),
      icon: 'images/svg/paybill/star.svg',
      route: './templates',
    },
  ] as const;

export const buildDynamicIdentification = <
  T extends Record<string, string | number | boolean | null | undefined>,
>(
  formValues: T,
) => {
  const { amount, ...identification } = formValues;

  return identification;
};
