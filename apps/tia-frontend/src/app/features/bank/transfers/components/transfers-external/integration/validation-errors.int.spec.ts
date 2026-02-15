import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TransferTestContext,
  setupTransferTest,
  cleanupTransferTest,
  BASE_URL,
  mockSenderAccountGEL,
  mockSenderAccountUSD,
  mockRecipientAccountGEL,
  mockRecipientResponsePhone,
} from './transfers-external.test-helpers';
import { recipientValidator } from '../validators/transfer-validator';
import { FormControl } from '@angular/forms';

describe('External Transfer - Validation Errors', () => {
  let ctx: TransferTestContext;

  beforeEach(async () => {
    ctx = await setupTransferTest();
  });

  afterEach(() => {
    cleanupTransferTest(ctx.httpMock);
  });

  it('should set error when user enters own phone number', () => {
    ctx.recipientService.verifyRecipient('555123456');

    ctx.httpMock.expectNone(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-personal-info`,
    );

    expect(ctx.transferStore.error()).toBe(
      'transfers.external.recipient.ownPhoneError',
    );
  });

  it('should reject invalid format with validator', () => {
    const control = new FormControl(
      'xyz-invalid',
      recipientValidator(ctx.validationService),
    );

    expect(control.valid).toBe(false);
    expect(control.errors).toEqual({ invalidFormat: true });
  });

  it('should reject invalid phone number with validator', () => {
    const control = new FormControl(
      '12345',
      recipientValidator(ctx.validationService),
    );

    expect(control.valid).toBe(false);
    expect(control.errors).toEqual({ invalidPhone: true });
  });

  it('should reject invalid IBAN with validator', () => {
    const control = new FormControl(
      'GE29TIA',
      recipientValidator(ctx.validationService),
    );

    expect(control.valid).toBe(false);
    expect(control.errors).toEqual({ invalidIban: true });
  });

  it('should accept valid phone number', () => {
    const control = new FormControl(
      '599112233',
      recipientValidator(ctx.validationService),
    );

    expect(control.valid).toBe(true);
    expect(control.errors).toBeNull();
  });

  it('should accept valid same-bank IBAN', () => {
    const control = new FormControl(
      'GE29TIA0000000000099',
      recipientValidator(ctx.validationService),
    );

    expect(control.valid).toBe(true);
    expect(control.errors).toBeNull();
  });

  it('should accept valid external IBAN', () => {
    const control = new FormControl(
      'GE29BOG0000000000011',
      recipientValidator(ctx.validationService),
    );

    expect(control.valid).toBe(true);
    expect(control.errors).toBeNull();
  });

  it('should set error when recipient not found via API', async () => {
    ctx.recipientService.verifyRecipient('599000000');

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-personal-info`,
    );

    lookupReq.flush(
      { message: 'Not found' },
      { status: 404, statusText: 'Not Found' },
    );

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.external.recipient.recipientNotFound',
      );
      expect(ctx.transferStore.recipientInfo()).toBeNull();
    });
  });

  it('should disable sender account with currency mismatch', () => {
    const reason = ctx.recipientService.getDisabledReason(
      mockSenderAccountUSD,
      mockRecipientAccountGEL,
      false,
    );

    expect(reason).toBe('CURRENCY_MISMATCH');
  });

  it('should disable sender account with invalid permission', () => {
    const accountWithBadPermission = {
      ...mockSenderAccountGEL,
      id: 'bad-perm',
      permission: 1,
    };

    const reason = ctx.recipientService.getDisabledReason(
      accountWithBadPermission,
      mockRecipientAccountGEL,
      false,
    );

    expect(reason).toBe('PERMISSION_DENIED');
  });

  it('should disable sender account when permission=2 but currency is not GEL', () => {
    const usdWithPerm2 = {
      ...mockSenderAccountUSD,
      permission: 2,
      currency: 'USD',
    };

    const reason = ctx.recipientService.getDisabledReason(
      usdWithPerm2 as any,
      mockRecipientAccountGEL,
      false,
    );

    expect(reason).toBe('PERMISSION_DENIED');
  });

  it('should disable sender account when permission=4 but currency is GEL', () => {
    const gelWithPerm4 = {
      ...mockSenderAccountGEL,
      permission: 4,
      currency: 'GEL',
    };

    const reason = ctx.recipientService.getDisabledReason(
      gelWithPerm4 as any,
      mockRecipientAccountGEL,
      false,
    );

    expect(reason).toBe('PERMISSION_DENIED');
  });

  it('should allow currency mismatch for external IBAN transfers', () => {
    const reason = ctx.recipientService.getDisabledReason(
      mockSenderAccountUSD,
      mockRecipientAccountGEL,
      true,
    );

    expect(reason).toBeNull();
  });
});
