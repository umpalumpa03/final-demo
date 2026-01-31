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

  // describe('formatDate', () => {
  //   it('should format dates correctly', () => {
  //     expect(service.formatDate('2026-12-25')).toBe('12/25/2026');
  //     expect(service.formatDate('2026-01-05')).toBe('01/05/2026');
  //   });

  //   it('should handle different date formats', () => {
  //     const result1 = service.formatDate('2026-01-15');
  //     const result2 = service.formatDate('2026-12-25');
  //     expect(result1).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  //     expect(result2).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  //   });
  // });
});
