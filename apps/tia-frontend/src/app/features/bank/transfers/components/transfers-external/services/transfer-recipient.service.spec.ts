import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransferRecipientService } from './transfer-recipient.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { selectPhoneNumber } from 'apps/tia-frontend/src/app/store/personal-info/personal-info.selectors';
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
    recipientInfoSubject = new Subject<any>();

    mockStore = {
      recipientInput: signal(''),
      recipientType: signal(null),
      recipientInfo: signal(null),
      setExternalRecipient: vi.fn(),
      lookupRecipient: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setError: vi.fn(),
    };

    mockValidation = { identifyRecipientType: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TransferRecipientService,
        provideMockStore({
          selectors: [{ selector: selectPhoneNumber, value: '995555123456' }],
        }),
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: TransferStore, useValue: mockStore },
        { provide: TransferValidationService, useValue: mockValidation },
      ],
    });

    service = TestBed.inject(TransferRecipientService);

    Object.defineProperty(service, 'recipientInfo$', {
      value: recipientInfoSubject.asObservable(),
      writable: true,
    });
  });

  describe('verifyRecipient', () => {
    it('should set error if phone matches own normalized phone number', () => {
      mockValidation.identifyRecipientType.mockReturnValue('phone');
      service.verifyRecipient('555123456');
      expect(mockStore.setError).toHaveBeenCalledWith(
        'transfers.external.recipient.ownPhoneError',
      );
    });

    it('should navigate and auto-select if API returns one account', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('phone');

      service.verifyRecipient('555000999');

      const mockData = { accounts: [{ id: 'acc1', currency: 'GEL' }] };

      recipientInfoSubject.next(null);
      recipientInfoSubject.next(mockData);

      await vi.waitFor(
        () => {
          expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
            mockData.accounts[0],
          );
          expect(mockRouter.navigate).toHaveBeenCalledWith([
            '/bank/transfers/external/accounts',
          ]);
        },
        { timeout: 1000 },
      );
    });

    it('should handle fallback IBAN account if API returns no accounts but has currency', async () => {
      mockValidation.identifyRecipientType.mockReturnValue('iban');
      service.verifyRecipient('GE123INTERNAL');

      const mockData = { accounts: [], currency: 'USD' };

      recipientInfoSubject.next(null);
      recipientInfoSubject.next(mockData);

      await vi.waitFor(() => {
        expect(mockStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'iban-recipient', currency: 'USD' }),
        );
      });
    });
  });

  describe('Disabling Logic', () => {
    it('should return PERMISSION_DENIED for invalid permissions', () => {
      const acc = { permission: 1, currency: 'GEL' } as any;
      expect(service.getDisabledReason(acc, null, false)).toBe(
        'PERMISSION_DENIED',
      );
    });

    it('should return CURRENCY_MISMATCH if currencies differ', () => {
      const sender = { permission: 2, currency: 'GEL' } as any;
      const recipient = { currency: 'USD' } as any;
      expect(service.getDisabledReason(sender, recipient, false)).toBe(
        'CURRENCY_MISMATCH',
      );
    });

    it('should return false for isRecipientAccountDisabled if no sender selected', () => {
      const acc = { currency: 'GEL' } as any;
      expect(service.isRecipientAccountDisabled(acc, null)).toBe(false);
    });
  });

  describe('Retries', () => {
    it('should call lookup on retry with data', () => {
      service.handleRetryRecipientLookup('val', 'phone');
      expect(mockStore.lookupRecipient).toHaveBeenCalled();
    });

    it('should go back on retry without data', () => {
      service.handleRetryRecipientLookup(null, null);
      expect(mockLocation.back).toHaveBeenCalled();
    });
  });
});
