import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferRepeatService } from './transfer-repeat.service';
import { TransferStore } from '../store/transfers.store';
import { TransfersApiService } from './transfersApi.service';
import { TransferValidationService } from '../components/transfers-external/services/transfer-validation.service';
import { TransferUtilsService } from './transfer-utils.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import {
  Account,
  AccountType,
} from 'apps/tia-frontend/src/app/shared/models/accounts/accounts.model';

function createMockAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: 'acc-123',
    userId: 'user-1',
    permission: 1,
    friendlyName: null,
    type: AccountType.current,
    currency: 'GEL',
    iban: 'GE00SENDER',
    name: 'Test Account',
    status: 'active',
    balance: 1000,
    createdAt: '2024-01-01',
    openedAt: '2024-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
    ...overrides,
  };
}

describe('TransferRepeatService', () => {
  let service: TransferRepeatService;
  let mockRouter: any;
  let mockTransferStore: any;
  let mockApi: any;
  let mockValidation: any;
  let mockUtils: any;
  let store: MockStore;

  const mockTransaction = {
    transferType: 'External',
    creditAccountNumber: 'GE00TEST',
    debitAccountNumber: 'GE00SENDER',
    amount: 100,
    description: 'Repeat',
    currency: 'GEL',
    meta: { recipientName: 'John Doe' },
  } as any;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };
    mockTransferStore = {
      setError: vi.fn(),
      setLoading: vi.fn(),
      setRecipientInput: vi.fn(),
      setExternalRecipient: vi.fn(),
      setManualRecipientName: vi.fn(),
      setSenderAccount: vi.fn(),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      updateFeeInfo: vi.fn(),
      setRecipientInfo: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setReceiverOwnAccount: vi.fn(),
    };
    mockApi = { lookupByIban: vi.fn() };
    mockValidation = { identifyRecipientType: vi.fn() };
    mockUtils = { isSenderAccountValid: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TransferRepeatService,
        provideMockStore({
          selectors: [
            {
              selector: selectAccounts,
              value: [createMockAccount()],
            },
          ],
        }),
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: TransfersApiService, useValue: mockApi },
        { provide: TransferValidationService, useValue: mockValidation },
        { provide: TransferUtilsService, useValue: mockUtils },
      ],
    });

    service = TestBed.inject(TransferRepeatService);
    store = TestBed.inject(MockStore);
  });

  it('should handle invalid IBAN or empty credit account', () => {
    mockValidation.identifyRecipientType.mockReturnValue(null);
    service.initRepeatTransfer({ ...mockTransaction, creditAccountNumber: '' });
    expect(mockTransferStore.setError).toHaveBeenCalledWith(
      'transfers.repeat.invalidIban',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/recipient',
    ]);
  });

  describe('handleExternalBank', () => {
    it('should navigate to amount on successful external setup', () => {
      mockValidation.identifyRecipientType.mockReturnValue(
        'iban-different-bank',
      );
      mockUtils.isSenderAccountValid.mockReturnValue(true);

      service.initRepeatTransfer(mockTransaction);

      expect(mockTransferStore.setSenderAccount).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });

    it('should set error if sender account is not found', () => {
      mockValidation.identifyRecipientType.mockReturnValue(
        'iban-different-bank',
      );
      store.overrideSelector(selectAccounts, []);
      store.refreshState();

      service.initRepeatTransfer(mockTransaction);
      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.external.accounts.senderNotFound',
      );
    });

    it('should set error if sender account is invalid via utils', () => {
      mockValidation.identifyRecipientType.mockReturnValue(
        'iban-different-bank',
      );
      mockUtils.isSenderAccountValid.mockReturnValue(false);

      service.initRepeatTransfer(mockTransaction);
      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.external.accounts.noPermission',
      );
    });
  });

  describe('handleSameBank', () => {
    it('should handle successful lookup and sender validation', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('iban-same-bank');
      const mockInfo = { accounts: [{ currency: 'GEL', id: 'r1' }] };
      mockApi.lookupByIban.mockReturnValue(of(mockInfo));
      mockUtils.isSenderAccountValid.mockReturnValue(true);

      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });

    it('should handle fallback recipient account creation', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('phone');
      mockApi.lookupByIban.mockReturnValue(
        of({ accounts: [], currency: 'GEL', fullName: 'Test' }),
      );
      mockUtils.isSenderAccountValid.mockReturnValue(true);

      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(
        mockTransferStore.setSelectedRecipientAccount,
      ).toHaveBeenCalledWith(expect.objectContaining({ id: 'iban-recipient' }));
    });

    it('should handle recipient account not found', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('phone');
      mockApi.lookupByIban.mockReturnValue(of({ accounts: [] }));
      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.recipientAccountNotFound',
      );
    });

    it('should handle same bank sender permission error', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('iban-same-bank');
      mockApi.lookupByIban.mockReturnValue(
        of({ accounts: [{ currency: 'GEL' }] }),
      );
      mockUtils.isSenderAccountValid.mockReturnValue(false);

      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.senderNoPermission',
      );
    });

    it('should handle lookup API error', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('iban-same-bank');
      mockApi.lookupByIban.mockReturnValue(throwError(() => new Error('404')));

      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.recipientNotFound',
      );
    });

    it('should find recipient account with matching currency', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('iban-same-bank');
      const mockInfo = {
        accounts: [
          { currency: 'USD', id: 'r1' },
          { currency: 'GEL', id: 'r2' },
        ],
      };
      mockApi.lookupByIban.mockReturnValue(of(mockInfo));
      mockUtils.isSenderAccountValid.mockReturnValue(true);

      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(
        mockTransferStore.setSelectedRecipientAccount,
      ).toHaveBeenCalledWith(
        expect.objectContaining({ currency: 'GEL', id: 'r2' }),
      );
    });

    it('should handle sender account not found in same bank', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('iban-same-bank');
      mockApi.lookupByIban.mockReturnValue(
        of({ accounts: [{ currency: 'GEL' }] }),
      );
      store.overrideSelector(selectAccounts, []);
      store.refreshState();

      service.initRepeatTransfer(mockTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.external.accounts.senderNotFound',
      );
    });
  });

  describe('handleInternalTransfer', () => {
    const internalTransaction = {
      transferType: 'OwnAccountTransfer',
      creditAccountNumber: 'GE00RECEIVER',
      debitAccountNumber: 'GE00SENDER',
      amount: 100,
      description: 'Internal transfer',
      currency: 'GEL',
    } as any;

    it('should handle successful internal transfer', async () => {
      store.overrideSelector(selectAccounts, [
        createMockAccount({ iban: 'GE00SENDER', permission: 1 }),
        createMockAccount({ iban: 'GE00RECEIVER', permission: 1 }),
      ]);
      store.refreshState();

      service.initRepeatTransfer(internalTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setSenderAccount).toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).toHaveBeenCalled();
      expect(mockTransferStore.setAmount).toHaveBeenCalledWith(100);
      expect(mockTransferStore.setDescription).toHaveBeenCalledWith(
        'Internal transfer',
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/amount',
      ]);
    });

    it('should handle sender account not found in internal transfer', async () => {
      store.overrideSelector(selectAccounts, [
        createMockAccount({ iban: 'GE00DIFFERENT' }),
      ]);
      store.refreshState();

      service.initRepeatTransfer(internalTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.senderNotFound',
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/from-account',
      ]);
    });

    it('should handle sender account without permission', async () => {
      store.overrideSelector(selectAccounts, [
        createMockAccount({ iban: 'GE00SENDER', permission: 0 }),
        createMockAccount({ iban: 'GE00RECEIVER', permission: 1 }),
      ]);
      store.refreshState();

      service.initRepeatTransfer(internalTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.senderNoPermission',
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/from-account',
      ]);
    });

    it('should handle sender account with null permission', async () => {
      store.overrideSelector(selectAccounts, [
        createMockAccount({ iban: 'GE00SENDER', permission: null as any }),
        createMockAccount({ iban: 'GE00RECEIVER', permission: 1 }),
      ]);
      store.refreshState();

      service.initRepeatTransfer(internalTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.senderNoPermission',
      );
    });

    it('should handle receiver account not found', async () => {
      store.overrideSelector(selectAccounts, [
        createMockAccount({ iban: 'GE00SENDER', permission: 1 }),
      ]);
      store.refreshState();

      service.initRepeatTransfer(internalTransaction);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setError).toHaveBeenCalledWith(
        'transfers.repeat.recipientAccountNotFound',
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/from-account',
      ]);
    });

    it('should handle empty description in internal transfer', async () => {
      store.overrideSelector(selectAccounts, [
        createMockAccount({ iban: 'GE00SENDER', permission: 1 }),
        createMockAccount({ iban: 'GE00RECEIVER', permission: 1 }),
      ]);
      store.refreshState();

      const transactionWithoutDesc = {
        ...internalTransaction,
        description: '',
      };

      service.initRepeatTransfer(transactionWithoutDesc);
      await new Promise((r) => setTimeout(r, 0));

      expect(mockTransferStore.setDescription).toHaveBeenCalledWith('');
    });
  });

  describe('handleExternalBank edge cases', () => {
    it('should handle missing recipientName in meta', () => {
      mockValidation.identifyRecipientType.mockReturnValue(
        'iban-different-bank',
      );
      mockUtils.isSenderAccountValid.mockReturnValue(true);

      const transactionWithoutMeta = {
        ...mockTransaction,
        meta: {},
      };

      service.initRepeatTransfer(transactionWithoutMeta);

      expect(mockTransferStore.setManualRecipientName).toHaveBeenCalledWith('');
    });

    it('should handle undefined meta', () => {
      mockValidation.identifyRecipientType.mockReturnValue(
        'iban-different-bank',
      );
      mockUtils.isSenderAccountValid.mockReturnValue(true);

      const transactionWithoutMeta = {
        ...mockTransaction,
        meta: undefined,
      };

      service.initRepeatTransfer(transactionWithoutMeta);

      expect(mockTransferStore.setManualRecipientName).toHaveBeenCalledWith('');
    });
  });
});
