import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransferRecipientService } from './transfer-recipient.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';

describe('TransferRecipientService', () => {
  let service: TransferRecipientService;
  let mockRouter: any;
  let mockLocation: any;
  let mockStore: any;
  let mockValidation: any;
  let recipientInfoSubject: Subject<any>;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };
    mockLocation = { back: vi.fn() };
    recipientInfoSubject = new Subject();

    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal(null),
      setExternalRecipient: vi.fn(),
      lookupRecipient: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
    };

    mockValidation = { identifyRecipientType: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TransferRecipientService,
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransferValidationService, useValue: mockValidation },
      ],
    });

    service = TestBed.inject(TransferRecipientService);
    (service as any).recipientInfo$ = recipientInfoSubject.asObservable();
  });

  describe('verifyRecipient', () => {
    it('should return early if data matches stored state (Optimization branch)', () => {
      mockStore.recipientInput.set('999');
      mockStore.recipientType.set('phone');
      mockStore.recipientInfo.set({ name: 'Existing' });
      mockValidation.identifyRecipientType.mockReturnValue('phone');

      service.verifyRecipient('999');

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/accounts',
      ]);
      expect(mockStore.lookupRecipient).not.toHaveBeenCalled();
    });

    it('should handle different bank IBAN directly', () => {
      mockValidation.identifyRecipientType.mockReturnValue(
        'iban-different-bank',
      );

      service.verifyRecipient('GE00EXT');

      expect(mockStore.setExternalRecipient).toHaveBeenCalledWith(
        'GE00EXT',
        'iban-different-bank',
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/accounts',
      ]);
    });

    it('should auto-select account when exactly one is returned', () => {
      mockValidation.identifyRecipientType.mockReturnValue('phone');
      service.verifyRecipient('555');

      const mockData = { accounts: [{ id: 'acc1' }] };
      recipientInfoSubject.next(null); 
      recipientInfoSubject.next(mockData);

      expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
        mockData.accounts[0],
      );
      expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should NOT auto-select if multiple accounts are returned', () => {
      mockValidation.identifyRecipientType.mockReturnValue('phone');
      service.verifyRecipient('555');

      const mockData = { accounts: [{ id: '1' }, { id: '2' }] };
      recipientInfoSubject.next(null);
      recipientInfoSubject.next(mockData);

      expect(mockStore.setSelectedRecipientAccount).not.toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalled();
    });
  });

  describe('Disabling Logic', () => {
    it('should handle isRecipientAccountDisabled currency logic', () => {
      const acc = { currency: 'USD' } as any;
      expect(
        service.isRecipientAccountDisabled(acc, { currency: 'GEL' } as any),
      ).toBe(true);
      expect(
        service.isRecipientAccountDisabled(acc, { currency: 'USD' } as any),
      ).toBe(false);
      expect(service.isRecipientAccountDisabled(acc, null)).toBe(false);
    });

    it('should handle isSenderAccountDisabled logic', () => {
      const acc = { currency: 'GEL' } as any;
      expect(service.isSenderAccountDisabled(acc, null, true)).toBe(false);
      expect(
        service.isSenderAccountDisabled(acc, { currency: 'USD' } as any, false),
      ).toBe(true);
      expect(service.isSenderAccountDisabled(acc, null, false)).toBe(false);
    });
  });

  it('should handleRetryRecipientLookup', () => {
    service.handleRetryRecipientLookup('val', 'phone' as any);
    expect(mockStore.lookupRecipient).toHaveBeenCalledWith({
      value: 'val',
      type: 'phone',
    });

    service.handleRetryRecipientLookup(null, null);
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
