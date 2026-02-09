import { describe, it, expect } from 'vitest';
import { calculateBitwiseSum } from './permission.utils';

describe('calculateBitwiseSum', () => {
  it('should calculate correct sum for selected permissions', () => {
    const formValues = {
      '1': true,
      '2': false,
      '4': true,
    };

    const result = calculateBitwiseSum(formValues);

    expect(result).toBe(5);
  });

  it('should return 0 if no permissions are selected', () => {
    const formValues = {
      '1': false,
      '2': false,
      '4': false,
    };

    const result = calculateBitwiseSum(formValues);

    expect(result).toBe(0);
  });

  it('should return 0 for an empty object', () => {
    const result = calculateBitwiseSum({});

    expect(result).toBe(0);
  });

  it('should handle large bitwise values correctly', () => {
    const formValues = {
      '8': true,
      '16': true,
      '32': false,
    };

    const result = calculateBitwiseSum(formValues);

    expect(result).toBe(24);
  });
});
