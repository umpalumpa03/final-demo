import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';
import { describe, it, expect } from 'vitest';

describe('dateRangeValidator', () => {
  const validator = dateRangeValidator('fromDate', 'toDate');

  it('should return null if fromDate is before toDate', () => {
    const group = new FormGroup({
      fromDate: new FormControl('2026-01-01'),
      toDate: new FormControl('2026-01-10')
    });
    expect(validator(group)).toBeNull();
  });

  it('should return error if fromDate is after toDate', () => {
    const group = new FormGroup({
      fromDate: new FormControl('2026-01-10'),
      toDate: new FormControl('2026-01-01')
    });
    expect(validator(group)).toEqual({ dateRangeInvalid: true });
  });

  it('should return null if one of the dates is missing', () => {
    const group = new FormGroup({
      fromDate: new FormControl('2026-01-01'),
      toDate: new FormControl(null)
    });
    expect(validator(group)).toBeNull();
  });
});