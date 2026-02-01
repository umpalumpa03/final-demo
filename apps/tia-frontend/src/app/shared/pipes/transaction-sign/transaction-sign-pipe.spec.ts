import { describe, it, expect } from 'vitest';
import { TransactionSignPipe } from './transaction-sign-pipe';

describe('TransactionSignPipe', () => {
  const pipe = new TransactionSignPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "-" when input is "debit"', () => {
    expect(pipe.transform('debit')).toBe('-');
  });

  it('should return "+" when input is "credit"', () => {
    expect(pipe.transform('credit')).toBe('+');
  });

  it('should handle uppercase inputs correctly', () => {
    expect(pipe.transform('DEBIT')).toBe('-');
  });

  it('should return empty string for null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
