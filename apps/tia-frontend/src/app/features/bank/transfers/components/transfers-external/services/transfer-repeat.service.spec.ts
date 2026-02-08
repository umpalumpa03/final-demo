import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferRepeatService } from './transfer-repeat.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { TransferValidationService } from './transfer-validation.service';
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
  let store: MockStore;

  const mockMeta = {
    senderAccountId: 's123',
    recipientIban: 'GE00TEST',
    recipientName: 'John Doe',
    amount: 100,
    description: 'Repeat Test',
  };

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };

    mockTransferStore = {
      setError: vi.fn(),
      setLoading: vi.fn(),
      setExternalRecipient: vi.fn(),
      setManualRecipientName: vi.fn(),
      setSenderAccount: vi.fn(),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      setRecipientInfo: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
    };

    mockApi = {
      lookupByIban: vi.fn(),
    };

    mockValidation = {
      identifyRecipientType: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferRepeatService,
        provideMockStore({
          selectors: [
            {
              selector: selectAccounts,
              value: [{ id: 's123', currency: 'GEL' }],
            },
          ],
        }),
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: TransfersApiService, useValue: mockApi },
        { provide: TransferValidationService, useValue: mockValidation },
      ],
    });

    service = TestBed.inject(TransferRepeatService);
    store = TestBed.inject(MockStore);
  });

  it('should set error and navigate back if IBAN is invalid', () => {
    mockValidation.identifyRecipientType.mockReturnValue(null);

    service.initRepeatTransfer(mockMeta);

    expect(mockTransferStore.setError).toHaveBeenCalledWith(
      'transfers.repeat.invalidIban',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external',
    ]);
  });

  it('should set error if sender account is not found in store', () => {
    mockValidation.identifyRecipientType.mockReturnValue('phone');
    store.overrideSelector(selectAccounts, []);
    store.refreshState();

    service.initRepeatTransfer(mockMeta);

    expect(mockTransferStore.setError).toHaveBeenCalledWith(
      'transfers.repeat.senderNotFound',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should handle external bank (different bank) path correctly', () => {
    mockValidation.identifyRecipientType.mockReturnValue('iban-different-bank');

    service.initRepeatTransfer(mockMeta);

    expect(mockTransferStore.setExternalRecipient).toHaveBeenCalledWith(
      mockMeta.recipientIban,
      'iban-different-bank',
    );
    expect(mockTransferStore.setManualRecipientName).toHaveBeenCalledWith(
      mockMeta.recipientName,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should handle same bank path with successful API lookup', async () => {
    mockValidation.identifyRecipientType.mockReturnValue('iban-same-bank');
    const mockRecipientInfo = {
      accounts: [{ id: 'r1', currency: 'GEL', iban: 'GE00TEST' }],
      fullName: 'Recipient User',
    };
    mockApi.lookupByIban.mockReturnValue(of(mockRecipientInfo));

    service.initRepeatTransfer(mockMeta);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockTransferStore.setLoading).toHaveBeenCalledWith(true);
    expect(mockTransferStore.setRecipientInfo).toHaveBeenCalled();
    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
    expect(mockTransferStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle same bank path when recipient has no accounts but has currency (fallback)', async () => {
    mockValidation.identifyRecipientType.mockReturnValue('phone');
    const mockRecipientInfo = { accounts: [], currency: 'USD' };
    mockApi.lookupByIban.mockReturnValue(of(mockRecipientInfo));

    service.initRepeatTransfer(mockMeta);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'iban-recipient', currency: 'USD' }),
    );
  });
});
