import { describe, it, expect } from 'vitest';
import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator, passwordValidator } from './form-validations';

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

