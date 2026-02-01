import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferExternalService } from './transfer.external.service';
import { TransferStore } from '../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { TransfersApiService } from './transfersApi.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { RecipientAccount } from '../models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';

describe('TransferExternalService', () => {
  let service: TransferExternalService;
  let mockRouter: any;
  let mockStore: any;
  let mockValidationService: any;
  let mockApi: any;

  beforeEach(() => {
    vi.useFakeTimers();

    mockRouter = { navigate: vi.fn() };
    mockApi = { getFee: vi.fn().mockReturnValue(of({ fee: 5 })) };

    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal(null),
      senderAccount: signal({ id: 'sender-1', currency: 'GEL' }),
      setExternalRecipient: vi.fn(),
      lookupRecipient: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
      setManualRecipientName: vi.fn(),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      setLoading: vi.fn(),
      updateFeeInfo: vi.fn(),
    };

    mockValidationService = {
      identifyRecipientType: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferExternalService,
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransferValidationService, useValue: mockValidationService },
        { provide: TransfersApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(TransferExternalService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate if data already exists', () => {
    mockStore.recipientInput.set('20202020');
    mockStore.recipientType.set('phone');
    mockStore.recipientInfo.set({ fullName: 'Test' });
    mockValidationService.identifyRecipientType.mockReturnValue('phone');

    service.verifyRecipient('20202020');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should disable recipient account if sender currency does not match', () => {
    const recipientAccount = { id: '1', currency: 'GEL' } as RecipientAccount;
    const senderAccount = { id: '2', currency: 'USD' } as Account;
    expect(
      service.isRecipientAccountDisabled(recipientAccount, senderAccount),
    ).toBe(true);
  });

  it('should disable sender account if recipient currency does not match (internal)', () => {
    const sender = { id: 's1', currency: 'USD' } as Account;
    const recipient = { id: 'r1', currency: 'GEL' } as RecipientAccount;
    expect(service.isSenderAccountDisabled(sender, recipient, false)).toBe(
      true,
    );
  });

  it('should NOT disable sender account for external IBAN', () => {
    const sender = { id: 's1', currency: 'USD' } as Account;
    expect(service.isSenderAccountDisabled(sender, null, true)).toBe(false);
  });

  it('should toggle recipient account selection (deselect if same)', () => {
    const account = { id: 'acc1' } as RecipientAccount;
    service.handleRecipientAccountSelect(account, account);
    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);
  });

  it('should select new recipient account if different', () => {
    const account = { id: 'acc1' } as RecipientAccount;
    service.handleRecipientAccountSelect(account, { id: 'acc2' } as any);
    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(account);
  });

  it('should toggle sender account selection', () => {
    const account = { id: 's1' } as Account;
    service.handleSenderAccountSelect(account, account);
    expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
  });


  it('should navigate to amount on handleContinue', () => {
    service.handleContinue(
      { id: 'r1' } as any,
      { id: 's1' } as any,
      false,
      null,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should save manual name and navigate for external IBAN', () => {
    service.handleContinue(null, { id: 's1' } as any, true, 'Manual Name');
    expect(mockStore.setManualRecipientName).toHaveBeenCalledWith(
      'Manual Name',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });


  describe('Fee Calculation', () => {
    it('should reset fee if amount is 0', () => {
      service.handleAmountInput(0);
      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
    });

    it('should trigger fee calculation after debounce', () => {
      service.handleAmountInput(100);
      vi.advanceTimersByTime(300);
      expect(mockApi.getFee).toHaveBeenCalled();
      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(5, 105);
    });

    it('should handle API error in fee calculation', () => {
      mockApi.getFee.mockReturnValue(throwError(() => new Error()));
      service.handleAmountInput(100);
      vi.advanceTimersByTime(300);
      expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
    });
  });

  it('should return true for valid transfer in handleTransfer', () => {
    const result = service.handleTransfer(100, 'test');
    expect(result).toBe(true);
    expect(mockStore.setAmount).toHaveBeenCalledWith(100);
  });

  it('should handleAmountGoBack', () => {
    const mockNativeRouter = { back: vi.fn() };
    service.handleAmountGoBack(50, 'desc', mockNativeRouter);
    expect(mockStore.setAmount).toHaveBeenCalledWith(50);
    expect(mockNativeRouter.back).toHaveBeenCalled();
  });
});
