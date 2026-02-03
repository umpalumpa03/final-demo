import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransferExternalService } from './transfer.external.service';
import { TransferStore } from '../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { TransfersApiService } from './transfersApi.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';

describe('TransferExternalService', () => {
  let service: TransferExternalService;
  let mockRouter: any;
  let mockStore: any;
  let mockApi: any;
  let mockLocation: any;
  let recipientInfoSubject: Subject<any>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockRouter = { navigate: vi.fn() };
    mockLocation = { back: vi.fn() };
    mockApi = {
      getFee: vi.fn(),
      transferSameBank: vi.fn(),
      verifyTransfer: vi.fn(),
    };
    recipientInfoSubject = new Subject<any>();

    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal<any>(null),
      senderAccount: signal({ id: 's1', currency: 'GEL', balance: 1000 }),
      amount: signal(0),
      description: signal(''),
      selectedRecipientAccount: signal<any>(null),
      challengeId: signal<string | null>(null),

      setExternalRecipient: vi.fn(),
      lookupRecipient: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
      setManualRecipientName: vi.fn(),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      setLoading: vi.fn(),
      updateFeeInfo: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setRequiresOtp: vi.fn(),
      setChallengeId: vi.fn(),
      setTransferSuccess: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferExternalService,
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: TransferStore, useValue: mockStore },
        {
          provide: TransferValidationService,
          useValue: { identifyRecipientType: vi.fn() },
        },
        { provide: TransfersApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(TransferExternalService);
    (service as any)['recipientInfo$'] = recipientInfoSubject.asObservable();
  });

  it('should handle recipient info stream with multiple accounts', () => {
    const validation = TestBed.inject(TransferValidationService);
    validation.identifyRecipientType = vi.fn().mockReturnValue('phone');
    service.verifyRecipient('555123');
    const mockResponse = { accounts: [{ id: 'acc1' }, { id: 'acc2' }] };
    recipientInfoSubject.next(null);
    recipientInfoSubject.next(mockResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should skip API call if data is identical to store', () => {
    mockStore.recipientInput.set('999');
    mockStore.recipientType.set('phone');
    mockStore.recipientInfo.set({ id: 'existing' });
    const validation = TestBed.inject(TransferValidationService);
    validation.identifyRecipientType = vi.fn().mockReturnValue('phone');
    service.verifyRecipient('999');
    expect(mockStore.lookupRecipient).not.toHaveBeenCalled();
  });

  it('should handle sender account disabling logic', () => {
    const acc = { currency: 'GEL' } as any;
    expect(service.isSenderAccountDisabled(acc, null, true)).toBe(false);
    const recipientUSD = { currency: 'USD' } as any;
    expect(service.isSenderAccountDisabled(acc, recipientUSD, false)).toBe(
      true,
    );
  });

  it('should set insufficient balance and stop if amount exceeds sender balance', () => {
    mockStore.senderAccount.set({ id: 's1', balance: 100 });
    service.handleAmountInput(150);
    expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(true);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 150);
  });

  it('should calculate fee successfully and validate balance', () => {
    mockStore.senderAccount.set({ id: 's1', balance: 1000 });
    mockStore.amount.set(500);
    mockStore.recipientType.set('iban-different-bank');
    mockApi.getFee.mockReturnValue(of({ fee: 10 }));
    service.handleAmountInput(500);
    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(10, 510);
  });

  it('should handle same bank transfer requiring OTP', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: 'GE001' });
    mockStore.amount.set(100);
    const mockResponse = { verify: { method: 'SMS', challengeId: 'chal-123' } };
    mockApi.transferSameBank.mockReturnValue(of(mockResponse));
    service.handleSameBankTransfer();
    expect(mockStore.setChallengeId).toHaveBeenCalledWith('chal-123');
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(true);
  });

  it('should verify transfer successfully', () => {
    mockStore.challengeId.set('chal-123');
    mockApi.verifyTransfer.mockReturnValue(of({ success: true }));
    service.verifyTransfer('1234');
    expect(mockStore.setTransferSuccess).toHaveBeenCalledWith(true);
    expect(mockStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle error during transfer verification', () => {
    mockStore.challengeId.set('chal-123');
    mockApi.verifyTransfer.mockReturnValue(throwError(() => new Error('Err')));
    service.verifyTransfer('1234');
    expect(mockStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should handle API error in fee calculation', () => {
    mockStore.recipientType.set('iban-different-bank');
    mockApi.getFee.mockReturnValue(throwError(() => new Error('Err')));
    service.handleAmountInput(500);
    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
  });

  it('should handle same bank transfer NOT requiring OTP', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: 'GE001' });
    mockStore.amount.set(100);
    mockStore.challengeId.set('chal-123');
    const mockResponse = { verify: { method: null, challengeId: 'chal-123' } };
    mockApi.transferSameBank.mockReturnValue(of(mockResponse));
    mockApi.verifyTransfer.mockReturnValue(of({ success: true }));
    service.handleSameBankTransfer();
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(false);
  });

  it('should update info directly for same bank in handleAmountInput', () => {
    mockStore.recipientType.set('phone');
    mockStore.senderAccount.set({ id: 's1', balance: 1000 });
    service.handleAmountInput(200);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 200);
  });

  it('should reset amount and balance when selecting different account', () => {
    const currentAcc = { id: 'old' } as any;
    const newAcc = { id: 'new' } as any;
    service.handleRecipientAccountSelect(newAcc, currentAcc);
    expect(mockStore.setAmount).toHaveBeenCalledWith(0);
    expect(mockStore.setInsufficientBalance).toHaveBeenCalledWith(false);
  });

  it('should toggle selection off if the same account is selected', () => {
    const acc = { id: 'acc-123' } as any;
    service.handleRecipientAccountSelect(acc, acc);
    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);
  });
  it('should return early in handleSameBankTransfer if requirements are missing', () => {
    mockStore.senderAccount.set(null);
    service.handleSameBankTransfer();
    expect(mockStore.setLoading).not.toHaveBeenCalled();

    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: null });
    service.handleSameBankTransfer();
    expect(mockStore.setLoading).not.toHaveBeenCalled();
  });

  it('should handle API error in handleSameBankTransfer (catchError coverage)', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: 'GE123' });
    mockStore.amount.set(100);

    mockApi.transferSameBank.mockReturnValue(
      throwError(() => new Error('Server Down')),
    );

    service.handleSameBankTransfer();

    expect(mockStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should return early in verifyTransfer if challengeId is missing', () => {
    mockStore.challengeId.set(null);
    service.verifyTransfer('1234');
    expect(mockStore.setLoading).not.toHaveBeenCalled();
  });

  it('should handle handleSenderAccountSelect logic correctly', () => {
    const acc1 = { id: 's1' } as any;
    const acc2 = { id: 's2' } as any;

    service.handleSenderAccountSelect(acc1, acc2);
    expect(mockStore.setAmount).toHaveBeenCalledWith(0);
    expect(mockStore.setSenderAccount).toHaveBeenCalledWith(acc1);

    service.handleSenderAccountSelect(acc1, acc1);
    expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
  });


  it('should stop loading in setupFeeCalculation if amount changed (tap logic)', () => {
    mockStore.senderAccount.set({ id: 's1', balance: 1000 });
    mockStore.amount.set(999); 
    mockStore.recipientType.set('iban-different-bank');

    mockApi.getFee.mockReturnValue(of({ fee: 10 }));

    service.handleAmountInput(500);
    vi.advanceTimersByTime(300);

    expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    expect(mockStore.updateFeeInfo).not.toHaveBeenCalledWith(10, 510);
  });
});
