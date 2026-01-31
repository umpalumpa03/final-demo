import { describe, it, expect } from 'vitest';
import { formatPurpose } from './purposes.util';

describe('formatPurpose Util', () => {
  it('should return null if input is null or empty', () => {
    expect(formatPurpose(null)).toBeNull();
    expect(formatPurpose('')).toBeNull();
  });

  it('should replace underscores with spaces', () => {
    expect(formatPurpose('home_improvement')).toBe('Home Improvement');
  });
});
