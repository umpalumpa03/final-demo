import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransferStore } from './transfers.store';
import { TransfersApiService } from '../services/transfersApi.service';
import { initialTransferState } from './transfers.state';
import { of, throwError } from 'rxjs';

describe('TransferStore', () => {
  let store: any;
  let transfersApiMock: any;

  const mockResponse = {
    fullName: 'John Doe',
    accounts: [{ id: '1', iban: 'GE123', currency: 'GEL' }],
  };

  beforeEach(() => {
    transfersApiMock = {
      lookupByPhone: vi.fn(),
      lookupByIban: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferStore,
        { provide: TransfersApiService, useValue: transfersApiMock },
      ],
    });

    store = TestBed.inject(TransferStore);
  });

  it('should initialize with initial state', () => {
    expect(store.recipientInput()).toBe(initialTransferState.recipientInput);
    expect(store.isLoading()).toBe(false);
  });

  it('should update basic transaction details (Amount, Description, Name)', () => {
    store.setAmount(500);
    store.setDescription('Monthly Rent');
    store.setManualRecipientName('Landlord');

    expect(store.amount()).toBe(500);
    expect(store.description()).toBe('Monthly Rent');
    expect(store.manualRecipientName()).toBe('Landlord');
  });

  it('should handle fee updates and loading state', () => {
    store.setLoading(true);
    expect(store.isLoading()).toBe(true);

    store.updateFeeInfo(2.5, 502.5);
    expect(store.fee()).toBe(2.5);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle successful phone lookup', () => {
    transfersApiMock.lookupByPhone.mockReturnValue(of(mockResponse));

    store.lookupRecipient({ value: '555111', type: 'phone' });

    expect(transfersApiMock.lookupByPhone).toHaveBeenCalledWith('555111');
    expect(store.recipientInfo()).toEqual(mockResponse);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle successful IBAN lookup (Same Bank)', () => {
    transfersApiMock.lookupByIban.mockReturnValue(of(mockResponse));

    store.lookupRecipient({ value: 'GE999', type: 'iban-same-bank' });

    expect(transfersApiMock.lookupByIban).toHaveBeenCalledWith('GE999');
    expect(store.recipientInfo()).toEqual(mockResponse);
  });

  it('should handle lookup error and set the translation key as error', () => {
    transfersApiMock.lookupByPhone.mockReturnValue(
      throwError(() => ({ message: 'Any Error' })),
    );

    store.lookupRecipient({ value: '000', type: 'phone' });

    expect(store.error()).toBe(
      'transfers.external.recipient.recipientNotFound',
    );
    expect(store.isLoading()).toBe(false);
    expect(store.recipientInfo()).toBeNull();
  });

  it('should reset the store to initial state', () => {
    store.setAmount(100);
    store.setLoading(true);

    store.reset();

    expect(store.amount()).toBe(0);
    expect(store.isLoading()).toBe(false);
    expect(store.recipientInput()).toBe('');
  });

  it('should update specific state flags (Account, Verified)', () => {
    const mockAccount = { id: 's1', currency: 'GEL' } as any;

    store.setSenderAccount(mockAccount);
    store.setIsVerified(true);

    expect(store.senderAccount()).toEqual(mockAccount);
    expect(store.isVerified()).toBe(true);
  });

  it('should cover setExternalRecipient and verify state reset spread', () => {
    store.setAmount(100);
    store.setExternalRecipient('555', 'phone');
    expect(store.recipientInput()).toBe('555');
    expect(store.amount()).toBe(0);
  });

  it('should cover all remaining setters (OTP, Challenge, Success)', () => {
    const mockRecAcc = { id: 'r1' } as any;
    store.setSelectedRecipientAccount(mockRecAcc);
    store.setInsufficientBalance(true);
    store.setChallengeId('ch-123');
    store.setRequiresOtp(true);
    store.setTransferSuccess(true);

    expect(store.selectedRecipientAccount()).toEqual(mockRecAcc);
    expect(store.hasInsufficientBalance()).toBe(true);
    expect(store.challengeId()).toBe('ch-123');
    expect(store.requiresOtp()).toBe(true);
    expect(store.transferSuccess()).toBe(true);
  });
  it('should handle manual recipient info updates and clear errors', () => {
    store.setError('some.error');
    store.setLoading(true);

    store.setRecipientInfo(mockResponse, 'GE123', 'iban-same-bank');

    expect(store.recipientInfo()).toEqual(mockResponse);
    expect(store.recipientInput()).toBe('GE123');
    expect(store.recipientType()).toBe('iban-same-bank');
    expect(store.error()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });

  it('should handle fee loading and toast visibility flags', () => {
    store.setFeeLoading(true);
    expect(store.isFeeLoading()).toBe(true);

    store.setHasShownAmountToast(true);
    expect(store.hasShownAmountToast()).toBe(true);

    store.setRecipientInput('new-input');
    expect(store.recipientInput()).toBe('new-input');
  });
});
