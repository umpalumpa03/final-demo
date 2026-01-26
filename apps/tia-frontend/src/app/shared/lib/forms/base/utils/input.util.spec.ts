import { describe, it, expect } from 'vitest';
import {
  getValidationErrorMessage,
  generateUniqueId,
} from './input.util';

describe('getValidationErrorMessage', () => {
  it('should return empty string when errors is null or undefined', () => {
    expect(getValidationErrorMessage(null)).toBe('');
    expect(getValidationErrorMessage(undefined)).toBe('');
  });

  it('should return minlength message', () => {
    const errors = { minlength: { requiredLength: 5, actualLength: 2 } };
    expect(getValidationErrorMessage(errors)).toBe('Min length is 5');
  });

  it('should return maxlength message', () => {
    const errors = { maxlength: { requiredLength: 10, actualLength: 15 } };
    expect(getValidationErrorMessage(errors)).toBe('Max length is 10');
  });

  it('should return min value message', () => {
    const errors = { min: { min: 18, actual: 10 } };
    expect(getValidationErrorMessage(errors)).toBe('Minimum value is 18');
  });

  it('should return max value message', () => {
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
    expect(getValidationErrorMessage({ pattern: true })).toBe(
      'Invalid format',
    );
  });

  it('should return passwordStrength message', () => {
    expect(getValidationErrorMessage({ passwordStrength: true })).toBe(
      'Password is too weak',
    );
  });

  it('should return passwordRules message', () => {
    expect(getValidationErrorMessage({ passwordRules: true })).toBe(
      'Password does not meet requirements',
    );
  });

  it('should return passwordMismatch message when true', () => {
    expect(getValidationErrorMessage({ passwordMismatch: true })).toBe(
      'Passwords do not match',
    );
  });

  it('should return passwordMismatch message when object', () => {
    expect(getValidationErrorMessage({ passwordMismatch: { mismatch: true } }))
      .toBe('Passwords do not match');
  });

  it('should return fallback message for unknown errors', () => {
    expect(getValidationErrorMessage({ unknownError: true })).toBe(
      'Invalid value',
    );
  });
});

