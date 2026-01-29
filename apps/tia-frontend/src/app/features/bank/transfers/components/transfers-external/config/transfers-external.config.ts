import { TranslateService } from '@ngx-translate/core';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';

export const getRecipientInputConfig = (
  translate: TranslateService,
): InputConfig => ({
  placeholder: translate.instant(
    'transfers.external.recipient.inputPlaceholder',
  ),
  prefixIcon: 'images/svg/transfers/external-icon.svg',
});
