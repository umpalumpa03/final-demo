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
              value: [{ iban: 'GE00SENDER', currency: 'GEL' }],
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
  });
});
