import { describe, it, expect } from 'vitest';
import { FormControl, FormGroup } from '@angular/forms';
import { numberValidator, passwordMatchValidator } from './form-validations';

describe('passwordMatchValidator', () => {
  it('should return null when passwords match', () => {
    const form = new FormGroup({
      password: new FormControl('Test123!'),
      confirmPassword: new FormControl('Test123!')
    });
    
    const result = passwordMatchValidator(form);
    expect(result).toBeNull();
  });
});

describe('numberValidator', () => {
  it('should return null for valid phone number', () => {
    const control = new FormControl('512345678');

    const result = numberValidator(control);

    expect(result).toBeNull();
  });

  it('should return error for invalid phone number', () => {
    const control = new FormControl('41234');

    const result = numberValidator(control);

    expect(result).toEqual({
      numberRules: {
        notNineChars: true,
        mustStartWithFive: true,
        isNotNumber: false,
      },
    });
  });
});

