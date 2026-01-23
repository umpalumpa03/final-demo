import { describe, it, expect } from 'vitest';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getErrorMessage, passwordMatchValidator, passwordValidator } from './form-validations';

describe('getErrorMessage', () => {
  it('should return empty string when control is null', () => {
    const message = getErrorMessage(null, 'Field');
    expect(message()).toBe('');
  });

  it('should return required error message', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    control.updateValueAndValidity();
    
    const message = getErrorMessage(control, 'Username');
    expect(message()).toBe('Username is required');
  });

  it('should return minlength error message', () => {
    const control = new FormControl('ab', Validators.minLength(5));
    control.markAsTouched();
    control.updateValueAndValidity();
    
    const message = getErrorMessage(control, 'Password');
    expect(message()).toBe('min length of Password is 5');
  });

  it('should return password strength error message', () => {
    const control = new FormControl('weak');
    control.setErrors({ passwordStrength: true });
    
    const message = getErrorMessage(control, 'Password');
    expect(message()).toBe('Password must contain uppercase, lowercase, number, and special character');
  });

  it('should return password mismatch error message', () => {
    const control = new FormControl('password');
    control.setErrors({ PasswordNoMatch: true });
    
    const message = getErrorMessage(control, 'Confirm Password');
    expect(message()).toBe('Passwords do not match');
  });
});

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

describe('passwordValidator', () => {
  it('should return null for empty value', () => {
    const control = new FormControl('');
    const result = passwordValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for valid password', () => {
    const control = new FormControl('Test123!');
    const result = passwordValidator(control);
    expect(result).toBeNull();
  });
});
