import { describe, it, expect, beforeEach } from 'vitest';
import { PurposeFormatPipe } from './purpose.pipe';

describe('PurposeFormatPipe', () => {
  let pipe: PurposeFormatPipe;

  beforeEach(() => {
    pipe = new PurposeFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform underscore-separated strings correctly', () => {
    expect(pipe.transform('debt_consolidation')).toBe('Debt Consolidation');
  });
});
