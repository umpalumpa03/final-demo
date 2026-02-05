import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TransferValidationService } from '../services/transfer-validation.service';
export function recipientValidator(
  validationService: TransferValidationService,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const type = validationService.identifyRecipientType(value);

    if (!type) {
      return { invalidFormat: true };
    }

    if (type === 'phone' && !validationService.validatePhone(value)) {
      return { invalidPhone: true };
    }

    if (
      (type === 'iban-same-bank' || type === 'iban-different-bank') &&
      !validationService.validateIban(value)
    ) {
      return { invalidIban: true };
    }

    return null;
  };
}
