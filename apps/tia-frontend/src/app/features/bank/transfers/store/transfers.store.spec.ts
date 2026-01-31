import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransferStore } from './transfers.store';
import { TransfersApiService } from '../services/transfersApi.service';
import { initialTransferState } from './transfers.state';
import { of, throwError } from 'rxjs';
import { RecipientAccount } from '../models/transfers.state.model';
import {
  Account,
  AccountType,
} from '@tia/shared/models/accounts/accounts.model';

describe('TransferStore', () => {
  let store: any;
  let transfersApiMock: any;

  const mockResponse = {
    fullName: 'John Doe',
    accounts: [{ id: '1', iban: 'GE123', currency: 'GEL' }],
  };

  const mockAccount: Account = {
    id: '1',
    userId: 'user1',
    permission: 1,
    friendlyName: 'My Account',
    type: AccountType.current,
    currency: 'GEL',
    iban: 'GE123',
    name: 'Current Account',
    status: 'active',
    balance: 1000,
    createdAt: '2024-01-01',
    openedAt: '2024-01-01',
    closedAt: '',
    isFavorite: false,
  };

  const mockRecipientAccount: RecipientAccount = {
    id: '2',
    iban: 'GE456',
    currency: 'GEL',
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

  it('should set external recipient', () => {
    store.setExternalRecipient('DE123', 'iban-different-bank');

    expect(store.recipientInput()).toBe('DE123');
    expect(store.recipientType()).toBe('iban-different-bank');
    expect(store.recipientInfo()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('should set manual recipient name', () => {
    store.setManualRecipientName('Jane Doe');

    expect(store.manualRecipientName()).toBe('Jane Doe');
  });

  it('should set sender account', () => {
    store.setSenderAccount(mockAccount);

    expect(store.senderAccount()).toEqual(mockAccount);
  });

  it('should clear sender account when null', () => {
    store.setSenderAccount(mockAccount);
    store.setSenderAccount(null);

    expect(store.senderAccount()).toBeNull();
  });

  it('should set selected recipient account', () => {
    store.setSelectedRecipientAccount(mockRecipientAccount);

    expect(store.selectedRecipientAccount()).toEqual(mockRecipientAccount);
  });

  it('should clear selected recipient account when null', () => {
    store.setSelectedRecipientAccount(mockRecipientAccount);
    store.setSelectedRecipientAccount(null);

    expect(store.selectedRecipientAccount()).toBeNull();
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
    store.setSenderAccount(mockAccount);
    store.setSelectedRecipientAccount(mockRecipientAccount);

    store.reset();

    expect(store.recipientInput()).toBe(initialTransferState.recipientInput);
    expect(store.recipientInfo()).toBeNull();
    expect(store.error()).toBeNull();
    expect(store.senderAccount()).toBeNull();
    expect(store.selectedRecipientAccount()).toBeNull();
  });
});
