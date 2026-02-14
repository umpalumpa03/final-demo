import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Accounts } from '../../components/accounts/container/accounts';
import {
  CreateAccountRequest,
  AccountType,
  Account,
} from '@tia/shared/models/accounts/accounts.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import * as selectors from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { mockAccount } from './accounts.test-helpers';

describe('Accounts Container Integration Tests', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    const mockApiService = {
      getCurrencies: vi.fn().mockReturnValue(of(['GEL', 'USD', 'EUR'])),
    };

    await TestBed.configureTestingModule({
      imports: [Accounts, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectors.selectAccountsGrouped, value: {} },
            {
              selector: selectors.selectAccounts,
              value: [mockAccount],
            },
            { selector: selectors.selectIsLoading, value: false },
            { selector: selectors.selectIsFetching, value: false },
            { selector: selectors.selectIsCreating, value: false },
            { selector: selectors.selectCreateError, value: null },
            { selector: selectors.selectIsCreateModalOpen, value: false },
            { selector: selectors.selectError, value: null },
            { selector: selectors.selectIsUpdatingFriendlyName, value: false },
            { selector: selectors.selectUpdateFriendlyNameError, value: null },
          ],
        }),
        { provide: AccountsApiService, useValue: mockApiService },
        {
          provide: ActivatedRoute,
          useValue: { params: of({}), queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch loadActiveAccounts on ngOnInit', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.loadActiveAccounts({ forceRefresh: true }),
      );
    });

    it('should open create modal when URL contains /create', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      vi.spyOn(router, 'url', 'get').mockReturnValue(
        '/bank/products/accounts/create',
      );

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.openCreateModal(),
      );
    });
  });

  describe('Account Creation Flow', () => {
    it('should handle account creation with valid form', () => {
      fixture.detectChanges();
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const navigateSpy = vi.spyOn(router, 'navigate');

      const mockRequest: CreateAccountRequest = {
        friendlyName: 'New Savings Account',
        type: AccountType.saving,
        currency: 'USD',
      };

      component['accountForm']().setValue({
        friendlyName: 'New Savings Account',
        type: AccountType.saving,
        currency: 'USD',
      });

      component.handleCreateAccount(mockRequest);

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.createAccount({ request: mockRequest }),
      );
      expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/accounts']);
    });

    it('should not dispatch action with invalid form', () => {
      fixture.detectChanges();
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      component['accountForm']().setValue({
        friendlyName: '',
        type: '',
        currency: '',
      });

      component.handleCreateAccount({} as any);

      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: AccountsActions.createAccount.type }),
      );
    });

    it('should handle open modal action', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.handleOpenModal();

      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/products/accounts/create',
      ]);
    });

    it('should handle close modal action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.handleCloseModal();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.closeCreateModal(),
      );
      expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/accounts']);
    });
  });

  describe('Transfer Flow', () => {
    it('should route to internal transfers for permission value 1', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.handleTransfer({ account: mockAccount, permissionValue: 1 });

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.selectAccount({ account: mockAccount }),
      );
      expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal'], {
        queryParams: { accountId: 'acc-123' },
      });
    });

    it('should route to external transfers for permission values 2 and 4', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.handleTransfer({ account: mockAccount, permissionValue: 2 });
      expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/external'], {
        queryParams: { accountId: 'acc-123' },
      });
    });

    it('should route to paybill for permission values 8 and 16', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.handleTransfer({ account: mockAccount, permissionValue: 8 });
      expect(navigateSpy).toHaveBeenCalledWith(['/bank/paybill'], {
        queryParams: { accountId: 'acc-123' },
      });
    });

    it('should route to loans for permission value 32', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.handleTransfer({ account: mockAccount, permissionValue: 32 });

      expect(navigateSpy).toHaveBeenCalledWith(['/bank/loans'], {
        queryParams: { accountId: 'acc-123' },
      });
    });
  });

  describe('Account Rename Flow', () => {
    it('should dispatch updateFriendlyName action', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      component.handleRenameAccount({
        accountId: 'acc-123',
        friendlyName: 'My Updated Account',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.updateFriendlyName({
          accountId: 'acc-123',
          friendlyName: 'My Updated Account',
        }),
      );
    });
  });

  describe('Retry Mechanism', () => {
    it('should dispatch loadActiveAccounts with forceRefresh on retry', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      component.handleRetry();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AccountsActions.loadActiveAccounts({ forceRefresh: true }),
      );
    });
  });
});
