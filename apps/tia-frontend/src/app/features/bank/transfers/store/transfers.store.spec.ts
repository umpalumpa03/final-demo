import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransferStore } from './transfers.store';
import { TransfersApiService } from '../services/transfersApi.service';
import { initialTransferState } from './transfers.state';
import { of, throwError } from 'rxjs';

describe('TransferStore (vitest)', () => {
  let store: any;
  let transfersApiMock: any;

  const mockResponse = {
    fullName: 'John Doe',
    accounts: [{ id: '1', accountNumber: 'ACC1' }],
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
    expect(store.recipientInfo()).toBeNull();
  });

  it('should handle successful lookupByPhone', () => {
    transfersApiMock.lookupByPhone.mockReturnValue(of(mockResponse));

    store.lookupRecipient({ value: '555123', type: 'phone' });

    expect(store.recipientInput()).toBe('555123');
    expect(store.recipientType()).toBe('phone');
    expect(store.recipientInfo()).toEqual(mockResponse);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle successful lookupByIban', () => {
    transfersApiMock.lookupByIban.mockReturnValue(of(mockResponse));

    store.lookupRecipient({ value: 'GE123', type: 'iban-same-bank' });

    expect(transfersApiMock.lookupByIban).toHaveBeenCalledWith('GE123');
    expect(store.recipientInfo()).toEqual(mockResponse);
  });

  it('should handle lookup error', () => {
    const errorMsg = 'Recipient not found';
    transfersApiMock.lookupByPhone.mockReturnValue(
      throwError(() => ({ message: errorMsg })),
    );

    store.lookupRecipient({ value: '555000', type: 'phone' });

    expect(store.error()).toBe(errorMsg);
    expect(store.isLoading()).toBe(false);
    expect(store.recipientInfo()).toBeNull();
  });

  it('should handle lookup error without message', () => {
    transfersApiMock.lookupByPhone.mockReturnValue(
      throwError(() => new Error()),
    );

    store.lookupRecipient({ value: '555000', type: 'phone' });

    expect(store.error()).toBe('Failed to find recipient');
  });

  it('should reset store to initial state', () => {
    transfersApiMock.lookupByPhone.mockReturnValue(of(mockResponse));
    store.lookupRecipient({ value: '555123', type: 'phone' });

    store.reset();

    expect(store.recipientInput()).toBe(initialTransferState.recipientInput);
    expect(store.recipientInfo()).toBeNull();
    expect(store.error()).toBeNull();
  });
});
