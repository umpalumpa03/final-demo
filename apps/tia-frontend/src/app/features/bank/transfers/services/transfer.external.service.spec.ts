import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransferExternalService } from './transfer.external.service';
import { TransferStore } from '../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { TransfersApiService } from './transfersApi.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('TransferExternalService', () => {
  let service: TransferExternalService;
  let mockRouter: any;
  let mockStore: any;
  let mockValidationService: any;
  let mockApi: any;
  let mockLocation: any;
  let recipientInfoSubject: Subject<any>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockRouter = { navigate: vi.fn() };
    mockLocation = { back: vi.fn() };
    mockApi = { getFee: vi.fn().mockReturnValue(of({ fee: 5 })) };
    recipientInfoSubject = new Subject<any>();

    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal(null),
      senderAccount: signal({ id: 's1', currency: 'GEL' }),
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

    mockValidationService = { identifyRecipientType: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TransferExternalService,
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransferValidationService, useValue: mockValidationService },
        { provide: TransfersApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(TransferExternalService);
    (service as any)['recipientInfo$'] = recipientInfoSubject;
  });

  it('should handle successful recipient lookup and auto-select', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    service.verifyRecipient('555123');
    recipientInfoSubject.next(null);
    recipientInfoSubject.next({ fullName: 'John', accounts: [{ id: 'acc1' }] });

    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should hit existing data and external IBAN branches', () => {
    mockStore.recipientInput.set('123');
    mockStore.recipientType.set('phone');
    mockStore.recipientInfo.set({ name: 'test' });
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    service.verifyRecipient('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);

    mockValidationService.identifyRecipientType.mockReturnValue(
      'iban-different-bank',
    );
    service.verifyRecipient('GE123EXTERNAL');
    expect(mockStore.setExternalRecipient).toHaveBeenCalledWith(
      'GE123EXTERNAL',
      'iban-different-bank',
    );
  });

  it('should hit currency comparison logic', () => {
    const accGEL = { currency: 'GEL' } as any;
    const accUSD = { currency: 'USD' } as any;

    expect(
      service.isRecipientAccountDisabled(accGEL, { currency: 'USD' } as any),
    ).toBe(true);
    expect(service.isRecipientAccountDisabled(accGEL, null)).toBe(false);
    expect(
      service.isSenderAccountDisabled(
        accUSD,
        { currency: 'GEL' } as any,
        false,
      ),
    ).toBe(true);
  });

  it('should hit toggle logic in selection', () => {
    const acc = { id: '1' } as any;

    service.handleRecipientAccountSelect(acc, acc);
    expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(null);

    service.handleSenderAccountSelect(acc, acc);
    expect(mockStore.setSenderAccount).toHaveBeenCalledWith(null);
  });

  it('should hit retry and location logic', () => {
    service.handleRetryRecipientLookup('val', 'phone');
    expect(mockStore.lookupRecipient).toHaveBeenCalled();

    service.handleRetryRecipientLookup(null, null);
    expect(mockLocation.back).toHaveBeenCalled();

    service.handleAmountGoBack(10, 'desc');
    expect(mockLocation.back).toHaveBeenCalledTimes(2);
  });

  it('should hit fee calculation and amount input logic', () => {
    service.handleAmountInput(0);
    expect(mockStore.updateFeeInfo).toHaveBeenCalledWith(0, 0);

    service.handleAmountInput(100);
    expect(mockStore.setLoading).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(300);
    expect(mockApi.getFee).toHaveBeenCalled();
  });
  it('should NOT auto-select if multiple accounts are returned', () => {
    mockValidationService.identifyRecipientType.mockReturnValue('phone');
    service.verifyRecipient('555123');

    recipientInfoSubject.next(null);
    recipientInfoSubject.next({
      fullName: 'John',
      accounts: [{ id: 'acc1' }, { id: 'acc2' }],
    });

    expect(mockStore.setSelectedRecipientAccount).not.toHaveBeenCalledWith({
      id: 'acc1',
    });
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should handle different handleContinue scenarios', () => {
    const sender = { id: 's1' } as any;
    const recipient = { id: 'r1' } as any;

    service.handleContinue(recipient, sender, false, null);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);

    service.handleContinue(null, sender, true, 'Giorgi');
    expect(mockStore.setManualRecipientName).toHaveBeenCalledWith('Giorgi');
  });

});
