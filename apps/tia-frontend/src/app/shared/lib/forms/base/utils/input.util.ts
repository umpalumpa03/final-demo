import { ValidationErrors } from '@angular/forms';

export function getValidationErrorMessage(
  errors: ValidationErrors | null | undefined,
): string {
  if (!errors) return '';

  if (errors['minlength']) {
    return `Min length is ${errors['minlength'].requiredLength}`;
  }
  if (errors['maxlength']) {
    return `Max length is ${errors['maxlength'].requiredLength}`;
  }
  if (errors['min']) {
    return `Minimum value is ${errors['min'].min}`;
  }
  if (errors['max']) {
    return `Maximum value is ${errors['max'].max}`;
  }

  if (errors['required']) return 'This field is required';
  if (errors['email']) return 'Invalid email address';
  if (errors['pattern']) return 'Invalid format';

  if (errors['passwordStrength']) return 'Password is too weak';
  if (errors['passwordRules']) return 'Password does not meet requirements';
  if (errors['passwordMismatch'] || errors['passwordMismatch'] === true) return 'Passwords do not match';

  return 'Invalid value';
}

export function generateUniqueId(prefix: string = 'field'): string {
  const random = Math.floor(Math.random() * 1000000);

  return `${prefix}-${random}`;
}
