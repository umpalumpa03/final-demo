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
      transferExternalBank: vi.fn(),
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
      manualRecipientName: signal(''),
      setFeeLoading: vi.fn(),
      setError: vi.fn(),

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

  it('should handle recipient info stream with auto-selection of single account', () => {
    const validation = TestBed.inject(TransferValidationService);
    validation.identifyRecipientType = vi.fn().mockReturnValue('phone');
    service.verifyRecipient('555123');
    const mockResponse = { accounts: [{ id: 'acc1' }] };
    recipientInfoSubject.next(null);
    recipientInfoSubject.next(mockResponse);

    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      mockResponse.accounts[0],
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should handle different bank IBAN (no API call)', () => {
    const validation = TestBed.inject(TransferValidationService);
    validation.identifyRecipientType = vi
      .fn()
      .mockReturnValue('iban-different-bank');
    service.verifyRecipient('GE0000');
    expect(mockStore.setExternalRecipient).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should calculate fee successfully and validate balance', () => {
    mockStore.senderAccount.set({ id: 's1', balance: 1000 });
    mockStore.amount.set(500);
    mockStore.recipientType.set('iban-different-bank');
    mockApi.getFee.mockReturnValue(of({ fee: 10 }));

    service.handleAmountInput(500);
    expect(mockStore.setFeeLoading).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(10, 510);
    expect(mockStore.setFeeLoading).toHaveBeenCalledWith(false);
  });

  it('should handle external bank transfer with OTP requirement', () => {
    mockStore.senderAccount.set({ id: 's1', currency: 'GEL' });
    mockStore.recipientInput.set('GE_EXT');
    mockStore.amount.set(200);
    mockStore.manualRecipientName.set('Recipient Name');

    const mockResponse = {
      verify: { method: 'EMAIL', challengeId: 'ext-chal' },
    };
    mockApi.transferExternalBank.mockReturnValue(of(mockResponse));

    service.handleOtherBankTransfer();
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(true);
    expect(mockStore.setChallengeId).toHaveBeenCalledWith('ext-chal');
  });

  it('should handle same bank transfer requiring OTP', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: 'GE001' });
    mockStore.amount.set(100);
    const mockResponse = { verify: { method: 'SMS', challengeId: 'chal-123' } };
    mockApi.transferSameBank.mockReturnValue(of(mockResponse));

    service.handleSameBankTransfer();
    expect(mockStore.setError).toHaveBeenCalledWith('');
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(true);
  });

  it('should handle handleRetryRecipientLookup logic', () => {
    service.handleRetryRecipientLookup('val', 'phone' as any);
    expect(mockStore.lookupRecipient).toHaveBeenCalled();

    service.handleRetryRecipientLookup(null, null);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should handle handleContinue for external and same bank', () => {
    service.handleContinue(
      { id: 'r1' } as any,
      { id: 's1' } as any,
      false,
      null,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);

    service.handleContinue(null, { id: 's1' } as any, true, 'Name');
    expect(mockStore.setManualRecipientName).toHaveBeenCalledWith('Name');
  });

  it('should handleAmountGoBack correctly', () => {
    service.handleAmountGoBack(50, 'test');
    expect(mockStore.setAmount).toHaveBeenCalledWith(50);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should handleTransfer validation', () => {
    expect(service.handleTransfer(0, '')).toBe(false);
    expect(service.handleTransfer(10, 'ok')).toBe(true);
  });

  it('should return early in verifyTransfer if challengeId is missing', () => {
    mockStore.challengeId.set(null);
    service.verifyTransfer('1234');
    expect(mockStore.setLoading).not.toHaveBeenCalled();
  });

  it('should disable recipient account if currencies do not match', () => {
    const acc = { currency: 'USD' } as any;
    const sender = { currency: 'GEL' } as any;
    expect(service.isRecipientAccountDisabled(acc, sender)).toBe(true);
    expect(
      service.isRecipientAccountDisabled(acc, { currency: 'USD' } as any),
    ).toBe(false);
  });
  it('should cover catchError in handleSameBankTransfer', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: 'GE123' });
    mockStore.amount.set(100);
    mockApi.transferSameBank.mockReturnValue(
      throwError(() => ({ error: { message: 'Fail' } })),
    );

    service.handleSameBankTransfer();
    expect(mockStore.setError).toHaveBeenCalledWith('Fail');
    expect(mockStore.setLoading).toHaveBeenCalledWith(false);
  });

  it('should cover catchError in handleOtherBankTransfer', () => {
    mockStore.senderAccount.set({ id: 's1', currency: 'GEL' });
    mockStore.recipientInput.set('GE_OTHER');
    mockStore.amount.set(100);
    mockApi.transferExternalBank.mockReturnValue(
      throwError(() => ({ error: { message: 'Other Fail' } })),
    );

    service.handleOtherBankTransfer();
    expect(mockStore.setError).toHaveBeenCalledWith('Other Fail');
  });

  it('should cover fee calculation API error', () => {
    mockStore.recipientType.set('iban-different-bank');
    mockApi.getFee.mockReturnValue(throwError(() => new Error('Err')));
    service.handleAmountInput(500);
    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
  });

  it('should cover handleContinue with manual name for external IBAN', () => {
    service.handleContinue(null, { id: 's1' } as any, true, 'John Doe');
    expect(mockStore.setManualRecipientName).toHaveBeenCalledWith('John Doe');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should return early in verifyTransfer if no challengeId', () => {
    mockStore.challengeId.set(null);
    service.verifyTransfer();
    expect(mockStore.setLoading).not.toHaveBeenCalled();
  });

  it('should handleRetryRecipientLookup with and without values', () => {
    service.handleRetryRecipientLookup('test', 'phone' as any);
    expect(mockStore.lookupRecipient).toHaveBeenCalled();
    service.handleRetryRecipientLookup(null, null);
    expect(mockLocation.back).toHaveBeenCalled();
  });
  it('should handle same bank transfer WITHOUT requiring OTP', () => {
    mockStore.senderAccount.set({ id: 's1' });
    mockStore.selectedRecipientAccount.set({ iban: 'GE001' });
    mockStore.amount.set(100);
    const mockResponse = { verify: { method: null, challengeId: 'chal-999' } };
    mockApi.transferSameBank.mockReturnValue(of(mockResponse));
    mockApi.verifyTransfer.mockReturnValue(of({ success: true }));

    service.handleSameBankTransfer();
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(false);
  });

  it('should handle other bank transfer WITHOUT requiring OTP', () => {
    mockStore.senderAccount.set({ id: 's1', currency: 'GEL' });
    mockStore.recipientInput.set('GE_OTHER');
    mockStore.amount.set(100);
    const mockResponse = { verify: { method: null, challengeId: 'chal-888' } };
    mockApi.transferExternalBank.mockReturnValue(of(mockResponse));
    mockApi.verifyTransfer.mockReturnValue(of({ success: true }));

    service.handleOtherBankTransfer();
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(false);
  });

  it('should cover fee calculation amount mismatch guard', () => {
    mockStore.senderAccount.set({ id: 's1', balance: 1000 });
    mockStore.recipientType.set('iban-different-bank');
    mockApi.getFee.mockReturnValue(of({ fee: 10 }));

    service.handleAmountInput(500);
    mockStore.amount.set(999);

    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).not.toHaveBeenCalledWith(10, 510);
    expect(mockStore.setFeeLoading).toHaveBeenCalledWith(false);
  });

  it('should cover handleRecipientAccountSelect toggle logic', () => {
    const acc = { id: 'acc-1' } as any;
    service.handleRecipientAccountSelect(acc, acc);
    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);
  });

  it('should return early in transfer methods if requirements are missing', () => {
    service.handleSameBankTransfer(); 
    service.handleOtherBankTransfer(); 
    expect(mockStore.setLoading).not.toHaveBeenCalled();
  });

  it('should hit catchError branch in verifyTransfer', () => {
    mockStore.challengeId.set('ch-123');
    mockApi.verifyTransfer.mockReturnValue(
      throwError(() => ({ error: { message: 'OTP Wrong' } })),
    );
    service.verifyTransfer('1111');
    expect(mockStore.setError).toHaveBeenCalledWith('OTP Wrong');
  });


  it('should cover isRecipientAccountDisabled without sender account', () => {
    expect(
      service.isRecipientAccountDisabled({ currency: 'GEL' } as any, null),
    ).toBe(false);
  });
});
