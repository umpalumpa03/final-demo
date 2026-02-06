import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const form = control as FormGroup;
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
};

export function passwordValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  const errors = {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  };

  const isValid = Object.values(errors).every(Boolean);

  return isValid ? null : { passwordRules: errors };
}

export function numberValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const errors = {
    notNineChars: value.length !== 9,
    mustStartWithFive: !value.startsWith('5'),
    isNotNumber: isNaN(Number(value))
  };

  const hasError = Object.values(errors).some(error => error === true);

  return hasError ? { numberRules: errors } : null;
}
