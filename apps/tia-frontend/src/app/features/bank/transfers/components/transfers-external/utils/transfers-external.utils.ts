import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RecipientType } from '../../../models/transfers.state.model';

export function getErrorMessage(
  errors: ValidationErrors | null,
  translate: TranslateService,
): string {
  if (!errors) return '';

  if (errors['invalidFormat']) {
    return translate.instant(
      'transfers.external.recipient.errors.invalidFormat',
    );
  }
  if (errors['invalidPhone']) {
    return translate.instant(
      'transfers.external.recipient.errors.invalidPhone',
    );
  }
  if (errors['invalidIban']) {
    return translate.instant('transfers.external.recipient.errors.invalidIban');
  }

  return '';
}

export function getSuccessMessage(
  type: RecipientType,
  translate: TranslateService,
): string {
  const messages = {
    phone: 'transfers.external.recipient.success.validPhone',
    'iban-same-bank': 'transfers.external.recipient.success.validIbanSameBank',
    'iban-different-bank':
      'transfers.external.recipient.success.validIbanDifferentBank',
  };

  return translate.instant(messages[type]);
}
