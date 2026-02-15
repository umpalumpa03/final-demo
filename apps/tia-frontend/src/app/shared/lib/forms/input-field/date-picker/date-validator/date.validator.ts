import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function maxDateValidator(maxDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return control.value > maxDate ? { maxDate: true } : null;
  };
}

export function minDateValidator(minDate: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    return control.value < minDate ? { minDate: true } : null;
  };
}
