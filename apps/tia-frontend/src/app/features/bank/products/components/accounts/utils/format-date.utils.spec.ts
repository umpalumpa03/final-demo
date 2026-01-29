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
    it('should format currency with 2 decimal places', () => {
      const result = service.formatCurrency(1234.5);
      expect(result).toBe('1,234.50');
    });

    it('should format zero correctly', () => {
      const result = service.formatCurrency(0);
      expect(result).toBe('0.00');
    });

    it('should format negative numbers', () => {
      const result = service.formatCurrency(-500.25);
      expect(result).toBe('-500.25');
    });
  });

  // describe('formatDate', () => {
  //   it('should format date to MM/DD/YYYY format', () => {
  //     const result = service.formatDate('2024-01-15');
  //     expect(result).toBe('01/15/2024');
  //   });

  //   it('should handle different date formats', () => {
  //     const result = service.formatDate('2024-12-25');
  //     expect(result).toBe('12/25/2024');
  //   });
  // });
});
