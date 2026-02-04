import { TranslateService } from '@ngx-translate/core';
import { TabItem } from '@tia/shared/lib/navigation/models/tab.model';
import { PaybillDynamicFormValues } from '../services/paybill-dynamic-form/models/dynamic-form.model';
import { PaybillIdentification } from '../components/paybill-main/shared/models/paybill.model';

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

export const buildDynamicIdentification = (
  formValues: PaybillDynamicFormValues,
): PaybillIdentification => {
  const { ...identification } = formValues;

  const sanitized: PaybillIdentification = {};

  Object.keys(identification).forEach((key) => {
    const value = identification[key];
    sanitized[key] =
      value === null || value === undefined ? undefined : String(value);
  });

  return sanitized;
};
