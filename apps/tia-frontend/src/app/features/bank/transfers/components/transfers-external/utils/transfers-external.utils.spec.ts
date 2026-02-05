import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getErrorMessage, getSuccessMessage } from './transfers-external.utils';
import { TranslateService } from '@ngx-translate/core';

describe('TransfersExternalUtils', () => {
  let mockTranslate: TranslateService;

  beforeEach(() => {
    mockTranslate = {
      instant: vi.fn((key: string) => key),
    } as any;
  });

  describe('getErrorMessage', () => {
    it('should return empty string when no errors', () => {
      expect(getErrorMessage(null, mockTranslate)).toBe('');
    });

    it('should return invalidFormat error message', () => {
      const errors = { invalidFormat: true };
      const result = getErrorMessage(errors, mockTranslate);

      expect(result).toBe('transfers.external.recipient.errors.invalidFormat');
      expect(mockTranslate.instant).toHaveBeenCalledWith(
        'transfers.external.recipient.errors.invalidFormat',
      );
    });

    it('should return invalidPhone error message', () => {
      const errors = { invalidPhone: true };
      const result = getErrorMessage(errors, mockTranslate);

      expect(result).toBe('transfers.external.recipient.errors.invalidPhone');
      expect(mockTranslate.instant).toHaveBeenCalledWith(
        'transfers.external.recipient.errors.invalidPhone',
      );
    });

    it('should return invalidIban error message', () => {
      const errors = { invalidIban: true };
      const result = getErrorMessage(errors, mockTranslate);

      expect(result).toBe('transfers.external.recipient.errors.invalidIban');
      expect(mockTranslate.instant).toHaveBeenCalledWith(
        'transfers.external.recipient.errors.invalidIban',
      );
    });

    it('should return empty string for unknown error', () => {
      const errors = { unknownError: true };
      expect(getErrorMessage(errors, mockTranslate)).toBe('');
    });
  });

  describe('getSuccessMessage', () => {
    it('should return phone success message', () => {
      const result = getSuccessMessage('phone', mockTranslate);

      expect(result).toBe('transfers.external.recipient.success.validPhone');
      expect(mockTranslate.instant).toHaveBeenCalledWith(
        'transfers.external.recipient.success.validPhone',
      );
    });

    it('should return iban-same-bank success message', () => {
      const result = getSuccessMessage('iban-same-bank', mockTranslate);

      expect(result).toBe(
        'transfers.external.recipient.success.validIbanSameBank',
      );
      expect(mockTranslate.instant).toHaveBeenCalledWith(
        'transfers.external.recipient.success.validIbanSameBank',
      );
    });

    it('should return iban-different-bank success message', () => {
      const result = getSuccessMessage('iban-different-bank', mockTranslate);

      expect(result).toBe(
        'transfers.external.recipient.success.validIbanDifferentBank',
      );
      expect(mockTranslate.instant).toHaveBeenCalledWith(
        'transfers.external.recipient.success.validIbanDifferentBank',
      );
    });
  });
});
