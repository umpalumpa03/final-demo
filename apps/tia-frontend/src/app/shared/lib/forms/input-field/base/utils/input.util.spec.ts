import { describe, it, expect } from 'vitest';
import { getValidationErrorMessage } from './input.util';

describe('getValidationErrorMessage', () => {
  it('should return empty string when errors is null or undefined', () => {
    expect(getValidationErrorMessage(null)).toBe('');
    expect(getValidationErrorMessage(undefined)).toBe('');
  });

  it('should return correct maxlength message', () => {
    const errors = { maxlength: { requiredLength: 10, actualLength: 15 } };
    expect(getValidationErrorMessage(errors)).toBe('Max length is 10');
  });

  it('should return correct min value message', () => {
    const errors = { min: { min: 18, actual: 10 } };
    expect(getValidationErrorMessage(errors)).toBe('Minimum value is 18');
  });

  it('should return correct max value message', () => {
    const errors = { max: { max: 100, actual: 150 } };
    expect(getValidationErrorMessage(errors)).toBe('Maximum value is 100');
  });

  it('should return required message', () => {
    expect(getValidationErrorMessage({ required: true })).toBe(
      'This field is required',
    );
  });

  it('should return email message', () => {
    expect(getValidationErrorMessage({ email: true })).toBe(
      'Invalid email address',
    );
  });

  it('should return pattern message', () => {
    expect(getValidationErrorMessage({ pattern: true })).toBe('Invalid format');
  });

  it('should return passwordStrength message', () => {
    expect(getValidationErrorMessage({ passwordStrength: true })).toBe(
      'Password is too weak',
    );
  });
});
