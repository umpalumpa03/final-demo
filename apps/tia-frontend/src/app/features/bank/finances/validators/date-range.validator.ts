import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(fromKey: string, toKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromKey)?.value;
    const to = group.get(toKey)?.value;
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (fromDate > toDate) {
        return { dateRangeInvalid: true };
      }
    }
    return null;
  };
}