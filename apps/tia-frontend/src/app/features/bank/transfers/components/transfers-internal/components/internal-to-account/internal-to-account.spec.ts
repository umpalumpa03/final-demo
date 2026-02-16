import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalToAccount } from './internal-to-account';
import { TransferInternalService } from '../../services/transfer.internal.service';
import { TransferStore } from '../../../../store/transfers.store';
import { BreakpointService } from '../../../../../../../core/services/breakpoints/breakpoint.service';
import { AlertService } from '../../../../../../../core/services/alert/alert.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AccountsActions } from '../../../../../../../store/products/accounts/accounts.actions';
import {
  selectAccounts,
  selectError,
  selectIsLoading,
} from '../../../../../../../store/products/accounts/accounts.selectors';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('InternalToAccount', () => {
  let component: InternalToAccount;
  let fixture: ComponentFixture<InternalToAccount>;
  let mockStore: any;
  let mockTransferStore: any;
  let mockRouter: any;
  let mockBreakpointService: any;
  let mockTransferInternalService: any;
  let mockAlertService: any;
  let accountsSubject: BehaviorSubject<typeof mockAccounts>;

  const mockAccounts = [
    { id: 'acc1', name: 'Account 1', balance: 1000, isFavorite: false, permission: 1 },
    { id: 'acc2', name: 'Account 2', balance: 2000, isFavorite: true, permission: 1 },
  ];

  beforeEach(async () => {
    accountsSubject = new BehaviorSubject(mockAccounts);
    mockStore = {
      select: vi.fn((selector: unknown) => {
        if (selector === selectAccounts) return accountsSubject.asObservable();
        if (selector === selectIsLoading) return of(false);
        if (selector === selectError) return of(null);
        return of(null);
      }),
      dispatch: vi.fn(),
    };

    mockTransferStore = {
      receiverOwnAccount: signal(null),
      senderAccount: signal(null),
      error: signal(''),
      setSenderAccount: vi.fn(),
      setReceiverOwnAccount: vi.fn(),
      setError: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
      events: of(),
    };

    mockBreakpointService = {
      isMobile: signal(false),
    };

    mockTransferInternalService = {
      handleToAccountSelect: vi.fn(),
      restoreInternalSelection: vi.fn(),
    };

    mockAlertService = {
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InternalToAccount, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: Router, useValue: mockRouter },
        { provide: BreakpointService, useValue: mockBreakpointService },
        {
          provide: TransferInternalService,
          useValue: mockTransferInternalService,
        },
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalToAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch loadAccounts action', () => {
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({}),
      );
    });
  });

  describe('onAccountSelect', () => {
    it('should call transferInternalService.handleToAccountSelect', () => {
      const account = mockAccounts[0];
      component.onAccountSelect(account as any);

      expect(
        mockTransferInternalService.handleToAccountSelect,
      ).toHaveBeenCalled();
    });
  });

  describe('onRetry', () => {
    it('should dispatch loadAccounts action', () => {
      mockStore.dispatch.mockClear();
      component.onRetry();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({}),
      );
    });
  });

  describe('onGoBack', () => {
    it('should navigate to from-account page', () => {
      component.onGoBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/from-account',
      ]);
    });
  });

  describe('isContinueDisabled', () => {
    it('should return true when no account selected', () => {
      expect(component.isContinueDisabled()).toBe(true);
    });
  });

  describe('computed properties', () => {
    it('should have accounts signal', () => {
      expect(component.accounts()).toBeTruthy();
    });

    it('should have isLoading signal', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should have error signal', () => {
      expect(component.error()).toBe(null);
    });

    it('should have isFullWidth based on breakpoint', () => {
      expect(component.isFullWidth()).toBe(false);
    });
  });

  describe('onContinue', () => {
    it('should navigate to amount page when account is selected', () => {
      mockTransferStore.receiverOwnAccount.set(mockAccounts[0]);
      fixture.detectChanges();

      component.onContinue();

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/amount',
      ]);
    });

    it('should not navigate when no account is selected', () => {
      mockTransferStore.receiverOwnAccount.set(null);
      fixture.detectChanges();

      component.onContinue();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('getLastFourDigits', () => {
    it('should return last 4 digits of IBAN', () => {
      const iban = 'GB82WEST12345698765432';
      expect(component.getLastFourDigits(iban)).toBe('5432');
    });

    it('should handle empty IBAN', () => {
      expect(component.getLastFourDigits('')).toBe('');
    });
  });

  describe('onSwapAccounts', () => {
    it('should swap sender and receiver when both are selected', () => {
      const sender = mockAccounts[0];
      const recipient = mockAccounts[1];
      mockTransferStore.senderAccount.set(sender);
      mockTransferStore.receiverOwnAccount.set(recipient);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).toHaveBeenCalledWith(
        recipient,
      );
      expect(mockTransferStore.setReceiverOwnAccount).toHaveBeenCalledWith(
        sender,
      );
    });

    it('should not swap when sender is not selected', () => {
      mockTransferStore.senderAccount.set(null);
      mockTransferStore.receiverOwnAccount.set(mockAccounts[0]);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).not.toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should not swap when recipient is not selected', () => {
      // Only one account so transferableAccounts is empty and auto-select effect does not run
      accountsSubject.next([mockAccounts[0]]);
      mockTransferStore.senderAccount.set(mockAccounts[0]);
      mockTransferStore.receiverOwnAccount.set(null);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).not.toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should not swap when recipient has no permission', () => {
      const sender = mockAccounts[0];
      const recipient = { ...mockAccounts[1], permission: 0 };
      mockTransferStore.senderAccount.set(sender);
      mockTransferStore.receiverOwnAccount.set(recipient);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).not.toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should not swap when recipient permission is not 1', () => {
      const sender = mockAccounts[0];
      const recipient = { ...mockAccounts[1], permission: 2 };
      mockTransferStore.senderAccount.set(sender);
      mockTransferStore.receiverOwnAccount.set(recipient);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).not.toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should not swap when recipient permission is undefined', () => {
      const sender = mockAccounts[0];
      const recipient = { ...mockAccounts[1], permission: undefined };
      mockTransferStore.senderAccount.set(sender);
      mockTransferStore.receiverOwnAccount.set(recipient);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).not.toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });
  });

  describe('isSwapDisabled', () => {
    it('should return true when no recipient selected', () => {
      mockTransferStore.receiverOwnAccount.set(null);
      fixture.detectChanges();

      expect(component.isSwapDisabled()).toBe(true);
    });

    it('should return true when recipient has no permission', () => {
      mockTransferStore.receiverOwnAccount.set({ ...mockAccounts[0], permission: 0 });
      fixture.detectChanges();

      expect(component.isSwapDisabled()).toBe(true);
    });

    it('should return true when recipient permission is not 1', () => {
      mockTransferStore.receiverOwnAccount.set({ ...mockAccounts[0], permission: 2 });
      fixture.detectChanges();

      expect(component.isSwapDisabled()).toBe(true);
    });

    it('should return true when recipient permission is undefined', () => {
      mockTransferStore.receiverOwnAccount.set({ ...mockAccounts[0], permission: undefined });
      fixture.detectChanges();

      expect(component.isSwapDisabled()).toBe(true);
    });

    it('should return false when recipient has permission 1', () => {
      mockTransferStore.receiverOwnAccount.set(mockAccounts[0]);
      fixture.detectChanges();

      expect(component.isSwapDisabled()).toBe(false);
    });
  });

  describe('transferableAccounts', () => {
    it('should filter out the sender account', () => {
      mockTransferStore.senderAccount.set(mockAccounts[0]);
      fixture.detectChanges();

      expect(component.transferableAccounts()).toEqual([mockAccounts[1]]);
    });

    it('should return all accounts when no sender selected', () => {
      mockTransferStore.senderAccount.set(null);
      fixture.detectChanges();

      expect(component.transferableAccounts()).toEqual(mockAccounts);
    });
  });

  describe('hasRepeatError', () => {
    it('should return true for senderNotFound error', () => {
      mockTransferStore.error.set('transfers.repeat.senderNotFound');
      fixture.detectChanges();

      expect(component.hasRepeatError()).toBe(true);
    });

    it('should return true for senderNoPermission error', () => {
      mockTransferStore.error.set('transfers.repeat.senderNoPermission');
      fixture.detectChanges();

      expect(component.hasRepeatError()).toBe(true);
    });

    it('should return true for recipientAccountNotFound error', () => {
      mockTransferStore.error.set('transfers.repeat.recipientAccountNotFound');
      fixture.detectChanges();

      expect(component.hasRepeatError()).toBe(true);
    });

    it('should return false for other errors', () => {
      mockTransferStore.error.set('some.other.error');
      fixture.detectChanges();

      expect(component.hasRepeatError()).toBe(false);
    });

    it('should return false when no error', () => {
      mockTransferStore.error.set('');
      fixture.detectChanges();

      expect(component.hasRepeatError()).toBe(false);
    });
  });

  describe('effect - auto-select favorite account', () => {
    it('should auto-select favorite account when sender changes and no recipient selected', () => {
      mockTransferStore.senderAccount.set(mockAccounts[0]);
      mockTransferStore.receiverOwnAccount.set(null);
      fixture.detectChanges();

      expect(mockTransferStore.setReceiverOwnAccount).toHaveBeenCalledWith(
        mockAccounts[1],
      );
    });

    it('should not auto-select when recipient is already selected', () => {
      mockTransferStore.senderAccount.set(mockAccounts[0]);
      mockTransferStore.receiverOwnAccount.set(mockAccounts[1]);
      mockTransferStore.setReceiverOwnAccount.mockClear();
      fixture.detectChanges();

      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should not auto-select when no sender account', () => {
      mockTransferStore.senderAccount.set(null);
      mockTransferStore.receiverOwnAccount.set(null);
      mockTransferStore.setReceiverOwnAccount.mockClear();
      fixture.detectChanges();

      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });

    it('should not auto-select when no transferable accounts', () => {
      accountsSubject.next([mockAccounts[0]]);
      mockTransferStore.senderAccount.set(mockAccounts[0]);
      mockTransferStore.receiverOwnAccount.set(null);
      mockTransferStore.setReceiverOwnAccount.mockClear();
      fixture.detectChanges();

      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });
  });
});
