import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferAccountSelectionService } from './transfer-account-selection.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransferRecipientService } from './transfer-recipient.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('TransferAccountSelectionService', () => {
  let service: TransferAccountSelectionService;
  let mockRouter: any;
  let mockTransferStore: any;
  let mockRecipientService: any;
  let store: MockStore;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };

    mockTransferStore = {
      senderAccount: signal(null),
      selectedRecipientAccount: signal(null),
      setAmount: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
      setManualRecipientName: vi.fn(),
    };

    mockRecipientService = {
      isSenderAccountDisabled: vi.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        TransferAccountSelectionService,
        provideMockStore(),
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: TransferRecipientService, useValue: mockRecipientService },
      ],
    });

    service = TestBed.inject(TransferAccountSelectionService);
    store = TestBed.inject(MockStore);
  });

  describe('initAutoSelectionLogic', () => {
    it('should dispatch selectAccount null if isExternal is true', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const preSelected = { id: 's1', currency: 'GEL' } as any;

      TestBed.runInInjectionContext(() => {
        service.initAutoSelectionLogic(
          signal([]),
          signal([]),
          signal(true),
          signal(preSelected),
          vi.fn(),
        );
      });

      TestBed.flushEffects();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.selectAccount({ account: null }),
      );
    });

    it('should handle currency mismatch', () => {
      const onMismatch = vi.fn();
      const preSelected = { id: 's1', currency: 'USD' } as any;
      const recipient = { id: 'r1', currency: 'GEL' } as any;

      mockTransferStore.selectedRecipientAccount.set(recipient);

      TestBed.runInInjectionContext(() => {
        service.initAutoSelectionLogic(
          signal([]),
          signal([]),
          signal(false),
          signal(preSelected),
          onMismatch,
        );
      });

      TestBed.flushEffects();

      expect(onMismatch).toHaveBeenCalled();
    });

    it('should auto-select favorite recipient if available', () => {
      const favoriteRecipient = { id: 'r1', isFavorite: true } as any;

      TestBed.runInInjectionContext(() => {
        service.initAutoSelectionLogic(
          signal([]),
          signal([favoriteRecipient]),
          signal(false),
          signal(null),
          vi.fn(),
        );
      });

      TestBed.flushEffects();

      expect(
        mockTransferStore.setSelectedRecipientAccount,
      ).toHaveBeenCalledWith(favoriteRecipient);
    });

    it('should auto-select favorite sender if available and not disabled', () => {
      const favoriteSender = { id: 's1', isFavorite: true } as any;
      mockRecipientService.isSenderAccountDisabled.mockReturnValue(false);

      TestBed.runInInjectionContext(() => {
        service.initAutoSelectionLogic(
          signal([favoriteSender]),
          signal([]),
          signal(false),
          signal(null),
          vi.fn(),
        );
      });

      TestBed.flushEffects();

      expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(
        favoriteSender,
      );
    });
  });

  describe('handleRecipientAccountSelect', () => {
    it('should reset amount and select new account if IDs differ', () => {
      const current = { id: 'old' } as any;
      const next = { id: 'new' } as any;

      service.handleRecipientAccountSelect(next, current);

      expect(mockTransferStore.setAmount).toHaveBeenCalledWith(0);
      expect(
        mockTransferStore.setSelectedRecipientAccount,
      ).toHaveBeenCalledWith(next);
    });

    it('should not reset if same account and is iban-recipient', () => {
      const acc = { id: 'iban-recipient' } as any;
      service.handleRecipientAccountSelect(acc, acc);
      expect(mockTransferStore.setAmount).not.toHaveBeenCalled();
    });

    it('should deselect if same account is clicked (non-iban)', () => {
      const acc = { id: 'r1' } as any;
      service.handleRecipientAccountSelect(acc, acc);
      expect(
        mockTransferStore.setSelectedRecipientAccount,
      ).toHaveBeenCalledWith(null);
    });
  });

  describe('handleSenderAccountSelect', () => {
    it('should reset amount and select sender if IDs differ', () => {
      const current = { id: 's1' } as any;
      const next = { id: 's2' } as any;

      service.handleSenderAccountSelect(next, current);

      expect(mockTransferStore.setAmount).toHaveBeenCalledWith(0);
      expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(next);
    });

    it('should toggle sender off if clicked again', () => {
      const acc = { id: 's1' } as any;
      service.handleSenderAccountSelect(acc, acc);
      expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(null);
    });
  });

  describe('handleContinue', () => {
    it('should navigate and set manual name for external IBAN', () => {
      const sender = { id: 's1' } as any;
      service.handleContinue(null, sender, true, 'John Doe');
      expect(mockTransferStore.setManualRecipientName).toHaveBeenCalledWith(
        'John Doe',
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });

    it('should navigate for internal transfer with recipient', () => {
      const sender = { id: 's1' } as any;
      const recipient = { id: 'r1' } as any;
      service.handleContinue(recipient, sender, false, null);
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });

    it('should not navigate if conditions are not met', () => {
      service.handleContinue(null, null, false, null);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
