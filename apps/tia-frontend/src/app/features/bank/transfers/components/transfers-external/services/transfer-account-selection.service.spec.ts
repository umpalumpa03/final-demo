import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransferAccountSelectionService } from './transfer-account-selection.service';
import { TransferStore } from '../../../store/transfers.store';
import { TransferUtilsService } from '../../../services/transfer-utils.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('TransferAccountSelectionService', () => {
  let service: TransferAccountSelectionService;
  let mockRouter: any;
  let mockTransferStore: any;
  let mockUtils: any;
  let store: MockStore;

  beforeEach(() => {
    mockRouter = { navigate: vi.fn() };
    mockTransferStore = {
      senderAccount: signal(null),
      selectedRecipientAccount: signal(null),
      setSenderAccount: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setAmount: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setManualRecipientName: vi.fn(),
    };
    mockUtils = { isSenderAccountValid: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TransferAccountSelectionService,
        provideMockStore(),
        { provide: Router, useValue: mockRouter },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: TransferUtilsService, useValue: mockUtils },
      ],
    });

    service = TestBed.inject(TransferAccountSelectionService);
    store = TestBed.inject(MockStore);
  });

  it('should auto-select valid pre-selected account', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const acc = { id: '1', currency: 'GEL' } as any;
    mockUtils.isSenderAccountValid.mockReturnValue(true);

    TestBed.runInInjectionContext(() => {
      service.initAutoSelectionLogic(
        signal([]),
        signal([]),
        signal(false),
        signal(acc),
        vi.fn(),
      );
    });

    TestBed.flushEffects();
    expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(acc);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.selectAccount({ account: null }),
    );
  });

  it('should trigger mismatch callback on invalid currency pre-selection', () => {
    const onMismatch = vi.fn();
    const acc = { id: '1', currency: 'USD' } as any;
    const recipient = { currency: 'GEL' } as any;
    mockTransferStore.selectedRecipientAccount.set(recipient);
    mockUtils.isSenderAccountValid.mockReturnValue(false);

    TestBed.runInInjectionContext(() => {
      service.initAutoSelectionLogic(
        signal([]),
        signal([]),
        signal(false),
        signal(acc),
        onMismatch,
      );
    });

    TestBed.flushEffects();
    expect(onMismatch).toHaveBeenCalled();
  });

  it('should auto-select favorite recipient and sender', () => {
    const favRecipient = { id: 'r1', isFavorite: true } as any;
    const favSender = { id: 's1', isFavorite: true } as any;
    mockUtils.isSenderAccountValid.mockReturnValue(true);

    TestBed.runInInjectionContext(() => {
      service.initAutoSelectionLogic(
        signal([favSender]),
        signal([favRecipient]),
        signal(false),
        signal(null),
        vi.fn(),
      );
    });

    TestBed.flushEffects();
    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      favRecipient,
    );
    expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(favSender);
  });

  it('should handle recipient selection and deselection', () => {
    const acc = { id: 'r1' } as any;
    service.handleRecipientAccountSelect(acc, null);
    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      acc,
    );
    expect(mockTransferStore.setAmount).toHaveBeenCalledWith(0);

    service.handleRecipientAccountSelect(acc, acc);
    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      null,
    );
  });

  it('should handle sender selection and deselection', () => {
    const acc = { id: 's1' } as any;
    service.handleSenderAccountSelect(acc, null);
    expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(acc);
    expect(mockTransferStore.setAmount).toHaveBeenCalledWith(0);

    service.handleSenderAccountSelect(acc, acc);
    expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(null);
  });

  it('should navigate on handleContinue', () => {
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

  it('should set manual name on continue for external iban', () => {
    service.handleContinue(null, { id: 's1' } as any, true, 'John');
    expect(mockTransferStore.setManualRecipientName).toHaveBeenCalledWith(
      'John',
    );
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
