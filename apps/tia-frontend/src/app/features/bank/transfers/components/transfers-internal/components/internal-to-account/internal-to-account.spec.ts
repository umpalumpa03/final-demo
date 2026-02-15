import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalToAccount } from './internal-to-account';
import { TransferInternalService } from '../../services/transfer.internal.service';
import { TransferStore } from '../../../../store/transfers.store';
import { BreakpointService } from '../../../../../../../core/services/breakpoints/breakpoint.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AccountsActions } from '../../../../../../../store/products/accounts/accounts.actions';
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

  const mockAccounts = [
    { id: 'acc1', name: 'Account 1', balance: 1000, isFavorite: false },
    { id: 'acc2', name: 'Account 2', balance: 2000, isFavorite: true },
  ];

  beforeEach(async () => {
    mockStore = {
      select: vi
        .fn()
        .mockReturnValueOnce(of(mockAccounts))
        .mockReturnValueOnce(of(false))
        .mockReturnValueOnce(of(null)),
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
    };

    mockBreakpointService = {
      isMobile: signal(false),
    };

    mockTransferInternalService = {
      handleToAccountSelect: vi.fn(),
      restoreInternalSelection: vi.fn(),
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
      mockTransferStore.senderAccount.set(mockAccounts[0]);
      mockTransferStore.receiverOwnAccount.set(null);
      fixture.detectChanges();

      component.onSwapAccounts();

      expect(mockTransferStore.setSenderAccount).not.toHaveBeenCalled();
      expect(mockTransferStore.setReceiverOwnAccount).not.toHaveBeenCalled();
    });
  });
});
