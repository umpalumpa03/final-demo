import { describe, it, expect, beforeEach } from 'vitest';
import { TransferValidationService } from './transfer-validation.service';

describe('TransferValidationService', () => {
  let service: TransferValidationService;

  beforeEach(() => {
    service = new TransferValidationService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should identify phone number', () => {
    expect(service.identifyRecipientType('+995555123456')).toBe('phone');
    expect(service.identifyRecipientType('+995 555 123 456')).toBe('phone');
  });

  it('should identify same bank IBAN', () => {
    expect(service.identifyRecipientType('GE29TIA7890123456789012')).toBe(
      'iban-same-bank',
    );
    expect(service.identifyRecipientType('GE00TIA9B721732BFA35B9')).toBe(
      'iban-same-bank',
    );
  });

  it('should identify different bank IBAN (Georgian)', () => {
    expect(service.identifyRecipientType('GE29XXX7890123456789012')).toBe(
      'iban-different-bank',
    );
    expect(service.identifyRecipientType('GE80BG0000000012345678')).toBe(
      'iban-different-bank',
    );
  });

  it('should identify international IBAN', () => {
    expect(service.identifyRecipientType('DE89370400440532013000')).toBe(
      'iban-different-bank',
    );
    expect(service.identifyRecipientType('FR1420041010050500013M02606')).toBe(
      'iban-different-bank',
    );
  });

  it('should return null for invalid input', () => {
    expect(service.identifyRecipientType('invalid')).toBeNull();
    expect(service.identifyRecipientType('123456')).toBeNull();
    expect(service.identifyRecipientType('')).toBeNull();
  });

  it('should validate phone number correctly', () => {
    expect(service.validatePhone('+995555123456')).toBe(true);
    expect(service.validatePhone('+995 555 123 456')).toBe(true);
    expect(service.validatePhone('+99555512345')).toBe(false);
    expect(service.validatePhone('+9955551234567')).toBe(false);
    expect(service.validatePhone('invalid')).toBe(false);
  });

  it('should validate IBAN correctly', () => {
    expect(service.validateIban('GE29TIA7890123456789012')).toBe(true);
    expect(service.validateIban('DE89370400440532013000')).toBe(true);
    expect(service.validateIban('FR1420041010050500013M02606')).toBe(true);
  });

  it('should reject invalid IBAN format', () => {
    expect(service.validateIban('GE29TIA78')).toBe(false);
    expect(service.validateIban('INVALID')).toBe(false);
    expect(service.validateIban('123456789')).toBe(false);
  });

  it('should reject IBAN with invalid length', () => {
    expect(service.validateIban('GE29TIA789012')).toBe(false);
    expect(service.validateIban('GE29TIA78901234567890123456789012345')).toBe(
      false,
    );
  });

  it('should get IBAN country code', () => {
    expect(service.getIbanCountry('GE29TIA7890123456789012')).toBe('GE');
    expect(service.getIbanCountry('DE89370400440532013000')).toBe('DE');
    expect(service.getIbanCountry('FR1420041010050500013M02606')).toBe('FR');
  });
});
