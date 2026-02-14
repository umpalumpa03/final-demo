import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ValidationService } from './input.util';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ValidationService', () => {
  let service: ValidationService;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [ValidationService],
    });
    service = TestBed.inject(ValidationService);
    translate = TestBed.inject(TranslateService);

    translate.setTranslation('en', {
      common: {
        validation: {
          required: 'This field is required',
          email: 'Invalid email address',
          pattern: 'Invalid format',
          passwordStrength: 'Password is too weak',
          passwordRules: 'Password does not meet requirements',
          passwordMismatch: 'Passwords do not match',
          default: 'Invalid value',
          min: 'Minimum value is {{min}}',
          max: 'Maximum value is {{max}}',
          minLength: 'Min length is {{requiredLength}}',
          maxLength: 'Max length is {{requiredLength}}',
        },
      },
    });
    translate.use('en');
  });

  it('should return empty string when errors is null or undefined', () => {
    expect(service.getErrorMessage(null)).toBe('');
    expect(service.getErrorMessage(undefined)).toBe('');
  });

  it('should return min value message', () => {
    const errors = { min: { min: 18, actual: 10 } };
    expect(service.getErrorMessage(errors)).toBe('Minimum value is 18');
  });

  it('should return max value message', () => {
    const errors = { max: { max: 100, actual: 150 } };
    expect(service.getErrorMessage(errors)).toBe('Maximum value is 100');
  });

  it('should return required message', () => {
    expect(service.getErrorMessage({ required: true })).toBe(
      'This field is required',
    );
  });

  it('should return email message', () => {
    expect(service.getErrorMessage({ email: true })).toBe(
      'Invalid email address',
    );
  });

  it('should return pattern message', () => {
    expect(service.getErrorMessage({ pattern: true })).toBe('Invalid format');
  });

  it('should return passwordStrength message', () => {
    expect(service.getErrorMessage({ passwordStrength: true })).toBe(
      'Password is too weak',
    );
  });

  it('should return passwordRules message', () => {
    expect(service.getErrorMessage({ passwordRules: true })).toBe(
      'Password does not meet requirements',
    );
  });

  it('should return passwordMismatch message', () => {
    expect(service.getErrorMessage({ passwordMismatch: true })).toBe(
      'Passwords do not match',
    );
  });

  it('should return fallback message for unknown errors', () => {
    expect(service.getErrorMessage({ unknownError: true })).toBe(
      'Invalid value',
    );
  });
});
