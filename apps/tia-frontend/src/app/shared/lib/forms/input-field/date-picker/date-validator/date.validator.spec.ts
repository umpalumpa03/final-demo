import { FormControl } from '@angular/forms';
import { describe, it, expect } from 'vitest';
import { maxDateValidator, minDateValidator } from './date.validator';

describe('maxDateValidator', () => {
  const maxLimit = '2008-12-31';
  const validator = maxDateValidator(maxLimit);

  it('should return null if control value is empty or null', () => {
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('should return null if date is strictly less than max', () => {
    const control = new FormControl('2000-01-01');
    expect(validator(control)).toBeNull();
  });
});

describe('minDateValidator', () => {
  const minLimit = '2024-01-01';
  const validator = minDateValidator(minLimit);

  it('should return null if control value is empty or null', () => {
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('should return error if date is less than min', () => {
    const control = new FormControl('2023-12-31');
    expect(validator(control)).toEqual({ minDate: true });
  });
});
