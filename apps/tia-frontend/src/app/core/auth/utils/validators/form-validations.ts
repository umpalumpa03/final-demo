import { computed } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const getErrorMessage = (
  control: AbstractControl | null,
  label: string,
) =>
  computed(() => {
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return `${label} is required`;
    }

    if (control.hasError('minlength')) {
      return `min length of ${label} is ${control.errors?.['minlength']?.requiredLength}`;
    }

    if (control.hasError('passwordStrength')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (control.hasError('PasswordNoMatch')) {
      return 'Passwords do not match';
    }

    return 'Invalid field';
  });

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
  const value = control.value || '';

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
