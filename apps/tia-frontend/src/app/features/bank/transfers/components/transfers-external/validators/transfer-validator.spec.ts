import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormControl } from '@angular/forms';
import { recipientValidator } from './transfer-validator';
import { TransferValidationService } from '../../../services/transfer-validation.service';

describe('recipientValidator', () => {
  let mockValidationService: any;
  let validator: any;

  beforeEach(() => {
    mockValidationService = {
      identifyRecipientType: vi.fn(),
      validatePhone: vi.fn(),
      validateIban: vi.fn(),
      getIbanCountry: vi.fn(),
    };

    validator = recipientValidator(mockValidationService);
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should return null for null value', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('should return invalidFormat error when type is null', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(null);
    const control = new FormControl('invalid');

    expect(validator(control)).toEqual({ invalidFormat: true });
  });

  it('should return null for valid phone number', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    mockValidationService.validatePhone.mockReturnValue(true);
    const control = new FormControl('+995555123456');

    expect(validator(control)).toBeNull();
  });

  it('should return invalidPhone error for invalid phone', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    mockValidationService.validatePhone.mockReturnValue(false);
    const control = new FormControl('+99555512345');

    expect(validator(control)).toEqual({ invalidPhone: true });
  });

  it('should return null for valid same-bank IBAN', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(
      'iban-same-bank',
    );
    mockValidationService.validateIban.mockReturnValue(true);
    const control = new FormControl('GE29TIA7890123456789012');

    expect(validator(control)).toBeNull();
  });

  it('should return invalidIban error for invalid same-bank IBAN', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(
      'iban-same-bank',
    );
    mockValidationService.validateIban.mockReturnValue(false);
    const control = new FormControl('GE29TIA789');

    expect(validator(control)).toEqual({ invalidIban: true });
  });

  it('should return null for valid different-bank IBAN', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(
      'iban-different-bank',
    );
    mockValidationService.validateIban.mockReturnValue(true);
    const control = new FormControl('DE89370400440532013000');

    expect(validator(control)).toBeNull();
  });

  it('should return invalidIban error for invalid different-bank IBAN', () => {
    mockValidationService.identifyRecipientType.mockReturnValue(
      'iban-different-bank',
    );
    mockValidationService.validateIban.mockReturnValue(false);
    const control = new FormControl('DE893704');

    expect(validator(control)).toEqual({ invalidIban: true });
  });
});
