import { computed } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

    return '';
  });

export const confirmPasswordValidator: ValidatorFn = (control) => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  const child = control.get('confirmPassword');

  if (password && confirmPassword && password !== confirmPassword) {
    child?.setErrors({
      ...(child.errors || { message: 'password not matched' }),
      PasswordNoMatch: true,
    });
    return { PasswordNoMatch: true };
  }

  if (child?.hasError('PasswordNoMatch')) {
    const errs = { ...(child.errors || {}) };
    delete errs['PasswordNoMatch'];
    child.setErrors(Object.keys(errs).length ? errs : null);
  }
  return null;
};

export function passwordValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const valid =
    /[A-Z]/.test(control.value) &&
    /[a-z]/.test(control.value) &&
    /[0-9]/.test(control.value) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(control.value);

  return !valid ? { passwordStrength: true } : null;
}
