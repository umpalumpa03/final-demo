import { TranslateService } from '@ngx-translate/core';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';

export const getRecipientInputConfig = (
  translate: TranslateService,
): InputConfig => ({
  placeholder: translate.instant(
    'transfers.external.recipient.inputPlaceholder',
  ),
  prefixIcon: 'images/svg/transfers/person.svg',
});

export const getRecipientIconByType = (type: string | null): string => {
  switch (type) {
    case 'phone':
      return 'images/svg/transfers/phone.svg';
    case 'iban-same-bank':
    case 'iban-different-bank':
      return 'images/svg/transfers/recipient-info-input.svg';
    default:
      return 'images/svg/transfers/person.svg';
  }
};
