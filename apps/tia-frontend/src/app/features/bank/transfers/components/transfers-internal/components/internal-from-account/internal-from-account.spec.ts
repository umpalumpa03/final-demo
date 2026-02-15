import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalFromAccount } from './internal-from-account';
import { TransferInternalService } from '../../services/transfer.internal.service';
import { TransferStore } from '../../../../store/transfers.store';
import { BreakpointService } from '../../../../../../../core/services/breakpoints/breakpoint.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import {
  selectAccounts,
  selectError,
  selectIsLoading,
  selectSelectedAccount,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from '../../../../../../../store/products/accounts/accounts.actions';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';

describe('InternalFromAccount', () => {
  let component: InternalFromAccount;
  let fixture: ComponentFixture<InternalFromAccount>;
  let mockStore: any;
  let mockTransferStore: any;
  let mockRouter: any;
  let mockBreakpointService: any;
  let mockTransferInternalService: any;

  const mockAccounts: Partial<Account>[] = [
    {
      id: 'acc1',
      name: 'Account 1',
      balance: 1000,
      permission: 1,
      isFavorite: true,
      iban: 'GE00TEST1',
      currency: 'GEL',
    },
    {
      id: 'acc2',
      name: 'Account 2',
      balance: 2000,
      permission: 1,
      isFavorite: false,
      iban: 'GE00TEST2',
      currency: 'GEL',
    },
  ];

  beforeEach(async () => {
    mockTransferStore = {
      senderAccount: signal(null),
      error: signal(null),
      setSenderAccount: vi.fn(),
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
      handleFromAccountSelect: vi.fn(),
      restoreInternalSelection: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InternalFromAccount, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAccounts, value: mockAccounts },
            { selector: selectIsLoading, value: false },
            { selector: selectError, value: null },
            { selector: selectSelectedAccount, value: null },
          ],
        }),
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: Router, useValue: mockRouter },
        { provide: BreakpointService, useValue: mockBreakpointService },
        {
          provide: TransferInternalService,
          useValue: mockTransferInternalService,
        },
      ],
    }).compileComponents();

    mockStore = TestBed.inject(Store);
    vi.spyOn(mockStore, 'dispatch');

    fixture = TestBed.createComponent(InternalFromAccount);
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
        AccountsActions.loadAccounts({})
      );
    });
  });

  describe('onAccountSelect', () => {
    it('should call transferInternalService.handleFromAccountSelect when account has permission', () => {
      const account = mockAccounts[0] as Account;
      component.onAccountSelect(account as any);

      expect(mockTransferInternalService.handleFromAccountSelect).toHaveBeenCalledWith(
        account,
        null
      );
    });

    it('should not call handleFromAccountSelect when account is disabled', () => {
      const disabledAccount = {
        ...mockAccounts[0],
        permission: 0,
      } as Account;
      component.onAccountSelect(disabledAccount as any);

      expect(mockTransferInternalService.handleFromAccountSelect).not.toHaveBeenCalled();
    });

    it('should not call handleFromAccountSelect when account has no permission', () => {
      const noPermissionAccount = {
        ...mockAccounts[0],
        permission: undefined,
      } as unknown as Account;
      component.onAccountSelect(noPermissionAccount as any);

      expect(mockTransferInternalService.handleFromAccountSelect).not.toHaveBeenCalled();
    });
  });

  describe('onRetry', () => {
    it('should dispatch loadAccounts action', () => {
      vi.mocked(mockStore.dispatch).mockClear();
      component.onRetry();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({})
      );
    });
  });

  describe('onContinue', () => {
    it('should navigate to to-account page when account is selected', () => {
      mockTransferStore.senderAccount.set(mockAccounts[0] as Account);
      fixture.detectChanges();

      component.onContinue();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/transfers/internal/to-account',
      ]);
    });

    it('should not navigate when continue is disabled', () => {
      mockTransferStore.senderAccount.set(null);
      fixture.detectChanges();

      component.onContinue();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('isContinueDisabled', () => {
    it('should return true when no account selected', () => {
      mockTransferStore.senderAccount.set(null);
      fixture.detectChanges();
      expect(component.isContinueDisabled()).toBe(true);
    });

    it('should return false when account is selected', () => {
      mockTransferStore.senderAccount.set(mockAccounts[0] as Account);
      fixture.detectChanges();
      expect(component.isContinueDisabled()).toBe(false);
    });
  });

  describe('isAccountDisabled', () => {
    it('should return true when account has no permission', () => {
      expect(
        component.isAccountDisabled({ permission: 0 } as Account)
      ).toBe(true);
    });

    it('should return true when account has undefined permission', () => {
      expect(
        component.isAccountDisabled({ permission: undefined } as unknown as Account)
      ).toBe(true);
    });

    it('should return true when permission bit 0 is not set', () => {
      expect(
        component.isAccountDisabled({ permission: 2 } as Account)
      ).toBe(true);
    });

    it('should return false when account has permission with bit 0 set', () => {
      expect(
        component.isAccountDisabled({ permission: 1 } as Account)
      ).toBe(false);
    });
  });

  describe('getDisabledReason', () => {
    it('should return PERMISSION_DENIED when account is disabled', () => {
      expect(
        component.getDisabledReason({ permission: 0 } as Account)
      ).toBe('PERMISSION_DENIED');
    });

    it('should return null when account is not disabled', () => {
      expect(
        component.getDisabledReason({ permission: 1 } as Account)
      ).toBeNull();
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
      mockTransferStore.error.set(
        'transfers.repeat.recipientAccountNotFound'
      );
      fixture.detectChanges();
      expect(component.hasRepeatError()).toBe(true);
    });

    it('should return false for other errors', () => {
      mockTransferStore.error.set('some.other.error');
      fixture.detectChanges();
      expect(component.hasRepeatError()).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should have accounts sorted by isFavorite', () => {
      const accounts = component.accounts();
      expect(accounts).toBeTruthy();
      expect(accounts.length).toBe(2);
      expect(accounts[0].isFavorite).toBe(true);
      expect(accounts[1].isFavorite).toBe(false);
    });

    it('should have isLoading signal', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should have error signal', () => {
      expect(component.error()).toBe(null);
    });

    it('should have isFullWidth based on breakpoint', () => {
      expect(component.isFullWidth()).toBe(false);
      mockBreakpointService.isMobile = signal(true);
      fixture = TestBed.createComponent(InternalFromAccount);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.isFullWidth()).toBe(true);
    });

    it('should have selectedFromAccount from transferStore', () => {
      mockTransferStore.senderAccount.set(mockAccounts[0] as Account);
      fixture.detectChanges();
      expect(component.selectedFromAccount()).toEqual(mockAccounts[0]);
    });

    it('should have transferError from transferStore', () => {
      mockTransferStore.error.set('test-error');
      fixture.detectChanges();
      expect(component.transferError()).toBe('test-error');
    });
  });
});
