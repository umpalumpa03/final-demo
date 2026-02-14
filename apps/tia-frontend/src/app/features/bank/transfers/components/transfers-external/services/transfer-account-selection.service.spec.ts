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
      setHasShownAmountToast: vi.fn(), 
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

  it('should auto-select valid pre-selected account and clear global selection', () => {
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

  it('should trigger mismatch callback and clear store if pre-selection is currency invalid', () => {
    const onMismatch = vi.fn();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
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
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.selectAccount({ account: null }),
    );
  });

  it('should auto-select favorite recipient and valid favorite sender', () => {
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

  it('should handle recipient selection and clear amount/toast if selection changes', () => {
    const acc = { id: 'r1' } as any;

    service.handleRecipientAccountSelect(acc, null);
    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      acc,
    );
    expect(mockTransferStore.setAmount).toHaveBeenCalledWith(0);
    expect(mockTransferStore.setHasShownAmountToast).toHaveBeenCalledWith(
      false,
    );

    service.handleRecipientAccountSelect(acc, acc);
    expect(mockTransferStore.setSelectedRecipientAccount).toHaveBeenCalledWith(
      null,
    );
  });

  it('should handle sender selection and deselection', () => {
    const acc = { id: 's1' } as any;

    service.handleSenderAccountSelect(acc, null);
    expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(acc);
    expect(mockTransferStore.setHasShownAmountToast).toHaveBeenCalledWith(
      false,
    );

    service.handleSenderAccountSelect(acc, acc);
    expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(null);
  });

  it('should navigate to amount step on handleContinue when both accounts selected', () => {
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

  it('should set manual name and navigate for external IBAN flows', () => {
    service.handleContinue(
      null,
      { id: 's1' } as any,
      true, 
      'Mariam Svanidze',
    );
    expect(mockTransferStore.setManualRecipientName).toHaveBeenCalledWith(
      'Mariam Svanidze',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should not navigate if recipient is missing and it is not external', () => {
    service.handleContinue(null, { id: 's1' } as any, false, null);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
