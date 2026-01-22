import { FormControl } from '@angular/forms';
import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './form-validations';

describe('getErrorMessage', () => {
  it('returns empty string when control is null', () => {
    const msg = getErrorMessage(null, 'name');
    expect(msg()).toBe('');
  });

  it('returns required message when control has required error', () => {
    const control = new FormControl('');
    control.setErrors({ required: true });
    const msg = getErrorMessage(control, 'name');
    expect(msg()).toBe('name is required');
  });

  it('returns minlength message when control has minlength error', () => {
    const control = new FormControl('a');
    control.setErrors({ minlength: { requiredLength: 5, actualLength: 1 } });
    const msg = getErrorMessage(control, 'message');
    expect(msg()).toBe('min length of message is 5');
  });
});
