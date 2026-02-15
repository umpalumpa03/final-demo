import { describe, it, expect } from 'vitest';
import { formatNumberDisplay, sanitizeNumberInput } from './number-input.util';

describe('NumberInputUtil', () => {
  describe('sanitizeNumberInput', () => {
    it('should remove scientific notation characters (e, E, +)', () => {
      expect(sanitizeNumberInput('1e+5')).toBe('15');
      expect(sanitizeNumberInput('2E3')).toBe('23');
    });

    it('should keep standard digits and single dots', () => {
      expect(sanitizeNumberInput('123.45')).toBe('123.45');
    });

    it('should handle multiple dots by keeping only the first one', () => {
      expect(sanitizeNumberInput('12.34.56')).toBe('12.3456');
    });

    it('should limit decimals to 2 digits', () => {
      expect(sanitizeNumberInput('10.12345')).toBe('10.12');
    });

    it('should handle decimal limit with exactly 2 digits', () => {
      expect(sanitizeNumberInput('10.99')).toBe('10.99');
    });

    it('should handle inputs with only a dot', () => {
      expect(sanitizeNumberInput('.')).toBe('.');
    });
  });

  describe('formatNumberDisplay', () => {
    it('should format simple numbers string', () => {
      expect(formatNumberDisplay(123)).toBe('123');
    });

    it('should format large numbers without scientific notation', () => {
      const result = formatNumberDisplay(1e20);
      expect(result).not.toContain('e');
      expect(result).toContain('100000');
    });

    it('should not add grouping commas', () => {
      expect(formatNumberDisplay(1000)).toBe('1000');
    });

    it('should handle fractional numbers', () => {
      expect(formatNumberDisplay(10.5)).toBe('10.5');
    });
  });
});
