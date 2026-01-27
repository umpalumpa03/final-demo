import { describe, it, expect } from 'vitest';
import { toTitleCase } from './titlecase.util';

describe('toTitleCase Util', () => {
  it('should return null if input is null', () => {
    expect(toTitleCase(null)).toBeNull();
  });

  it('should return empty string if input is empty', () => {
    expect(toTitleCase('')).toBeNull();
  });

  it('should convert all uppercase to title case', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('should convert all lowercase to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('should handle mixed case', () => {
    expect(toTitleCase('hElLo wOrLD')).toBe('Hello World');
  });
});
