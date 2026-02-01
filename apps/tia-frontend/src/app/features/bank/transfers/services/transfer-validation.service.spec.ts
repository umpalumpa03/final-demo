import { describe, it, expect, beforeEach } from 'vitest';
import { TransferValidationService } from './transfer-validation.service';

describe('TransferValidationService (vitest)', () => {
  let service: TransferValidationService;

  beforeEach(() => {
    service = new TransferValidationService();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should identify phone number when input starts with a digit', () => {
    expect(service.identifyRecipientType('599123456')).toBe('phone');
    expect(service.identifyRecipientType(' 995 555 123 ')).toBe('phone');
  });

  it('should identify same bank IBAN when it starts with GE and has TIA', () => {
    expect(service.identifyRecipientType('GE29TIA7890123456789012')).toBe(
      'iban-same-bank',
    );
    expect(service.identifyRecipientType('ge 00 tia 123')).toBe(
      'iban-same-bank',
    );
  });

  it('should identify different bank IBAN when it starts with GE but no TIA', () => {
    expect(service.identifyRecipientType('GE29BOG7890123456789012')).toBe(
      'iban-different-bank',
    );
  });

  it('should identify international IBAN based on regex pattern', () => {
    expect(service.identifyRecipientType('DE89370400440532013000')).toBe(
      'iban-different-bank',
    );
    expect(service.identifyRecipientType('FR1420041010050500013M02606')).toBe(
      'iban-different-bank',
    );
  });

  it('should return null for non-matching strings', () => {
    expect(service.identifyRecipientType('ABC')).toBeNull();
    expect(service.identifyRecipientType('!!123')).toBeNull();
  });

  it('should validate phone numbers between 8 and 9 digits', () => {
    expect(service.validatePhone('55512345')).toBe(true);
    expect(service.validatePhone('555123456')).toBe(true);
    expect(service.validatePhone('5551234')).toBe(false);
    expect(service.validatePhone('5551234567')).toBe(false);
  });

  it('should validate IBAN based on format and length', () => {
    expect(service.validateIban('GE29TIA7890123456789012')).toBe(true);
    expect(service.validateIban('GE29TIA789')).toBe(false);
    expect(service.validateIban('INVALID1234567890')).toBe(false);
  });

  it('should extract the country code from IBAN', () => {
    expect(service.getIbanCountry('GE29TIA')).toBe('GE');
    expect(service.getIbanCountry('DE89370')).toBe('DE');
  });
});
