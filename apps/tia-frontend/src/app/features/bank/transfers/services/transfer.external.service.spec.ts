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
    mockApi = { getFee: vi.fn() };
    recipientInfoSubject = new Subject<any>();

    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal<any>(null),
      senderAccount: signal({ id: 's1', currency: 'GEL', balance: 1000 }),
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

    expect(mockStore.setSelectedRecipientAccount).not.toHaveBeenCalled();
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
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
    expect(mockStore.lookupRecipient).not.toHaveBeenCalled();
  });

  it('should handle fee response as a raw number and catch errors', () => {
    mockApi.getFee.mockReturnValue(of(10));
    service.handleAmountInput(100);
    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(10, 110);

    mockApi.getFee.mockReturnValue(throwError(() => new Error('API FAIL')));
    service.handleAmountInput(200);
    vi.advanceTimersByTime(300);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
  });

  it('should validate transfer amount and set description', () => {
    const success = service.handleTransfer(50, 'Gift');
    expect(success).toBe(true);
    expect(mockStore.setAmount).toHaveBeenCalledWith(50);

    const fail = service.handleTransfer(-1, '');
    expect(fail).toBe(false);
  });

  it('should navigate back if retry is called without values', () => {
    service.handleRetryRecipientLookup(null, null);
    expect(mockLocation.back).toHaveBeenCalled();

    service.handleRetryRecipientLookup('val', 'phone');
    expect(mockStore.lookupRecipient).toHaveBeenCalled();
  });

  it('should handle sender account disabling logic', () => {
    const acc = { currency: 'GEL' } as any;
    expect(service.isSenderAccountDisabled(acc, null, true)).toBe(false);

    const recipientUSD = { currency: 'USD' } as any;
    expect(service.isSenderAccountDisabled(acc, recipientUSD, false)).toBe(
      true,
    );
  });

  it('should set manual name when continuing with external IBAN', () => {
    service.handleContinue(null, { id: 's1' } as any, true, 'John Doe');
    expect(mockStore.setManualRecipientName).toHaveBeenCalledWith('John Doe');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should set state and go back', () => {
    service.handleAmountGoBack(75, 'refund');
    expect(mockStore.setAmount).toHaveBeenCalledWith(75);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should toggle selection off if the same account is selected (Hits Toggle Branch)', () => {
    const acc = { id: 'acc-123' } as any;

    service.handleRecipientAccountSelect(acc, acc);
    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);

    service.handleSenderAccountSelect(acc, acc);
    expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
  });

  it('should return false for disabled checks when no currency is selected (Hits Guard Branch)', () => {
    const acc = { currency: 'GEL' } as any;

    expect(service.isRecipientAccountDisabled(acc, null)).toBe(false);

    expect(service.isSenderAccountDisabled(acc, null, false)).toBe(false);
  });

  it('should not navigate or call store if identifyRecipientType returns null (Hits Line 83 Branch)', () => {
    const validation = TestBed.inject(TransferValidationService);
    validation.identifyRecipientType = vi.fn().mockReturnValue(null);

    service.verifyRecipient('invalid-input');

    expect(mockStore.lookupRecipient).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should hit the catchError block in setupFeeCalculation (Hits Line 221)', () => {
    mockApi.getFee.mockReturnValue(
      throwError(() => new Error('Service Unavailable')),
    );

    service.handleAmountInput(500);
    vi.advanceTimersByTime(300); 

    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);
  });

  it('should do nothing in handleContinue if requirements are not met (Hits Line 178 Branch)', () => {
    service.handleContinue({ id: 'r1' } as any, null, false, null);
    expect(mockRouter.navigate).not.toHaveBeenCalled();

    service.handleContinue(null, { id: 's1' } as any, false, null);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
