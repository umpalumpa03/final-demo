import { describe, it, expect } from 'vitest';
import { CurrencySymbolPipe } from './currency-symbols.pipe';

describe('CurrencySymbolPipe', () => {
  const pipe = new CurrencySymbolPipe();

  it('should return GEL symbol', () => {
    expect(pipe.transform('GEL')).toBe('₾');
  });

  it('should return USD symbol', () => {
    expect(pipe.transform('USD')).toBe('$');
  });

  it('should return EUR symbol', () => {
    expect(pipe.transform('EUR')).toBe('€');
  });

  it('should return GBP symbol', () => {
    expect(pipe.transform('GBP')).toBe('£');
  });

  it('should return original value for unknown currency', () => {
    expect(pipe.transform('JPY')).toBe('JPY');
  });

  it('should return original value when not in map', () => {
    expect(pipe.transform('ABC')).toBe('ABC');
  });
});
