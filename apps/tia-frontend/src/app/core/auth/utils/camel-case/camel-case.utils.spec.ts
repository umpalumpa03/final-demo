import { describe, it, expect } from 'vitest';
import { toCamelCase } from './camel-case.utils';

describe('toCamelCase Utility', () => {
  it('should convert kebab-case strings to camelCase', () => {
    expect(toCamelCase('ocean-blue')).toBe('oceanBlue');
    expect(toCamelCase('my-super-theme')).toBe('mySuperTheme');
  });
  it('should return empty string for empty input', () => {
    expect(toCamelCase('')).toBe('');
    expect(toCamelCase('   ')).toBe('');
  });
});
