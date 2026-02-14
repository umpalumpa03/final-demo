import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FormatUtils } from './format-date.utils';

describe('FormatUtils', () => {
  let service: FormatUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatUtils],
    });
    service = TestBed.inject(FormatUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('formatCurrency', () => {
    it('should format currency correctly with various amounts', () => {
      expect(service.formatCurrency(1234.5)).toBe('1,234.50');
      expect(service.formatCurrency(0)).toBe('0.00');
      expect(service.formatCurrency(-500.25)).toBe('-500.25');
      expect(service.formatCurrency(1000000.99)).toBe('1,000,000.99');
      expect(service.formatCurrency(0.5)).toBe('0.50');
    });
  });
});
