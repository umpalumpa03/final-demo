import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accounts } from './accounts';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import {
  CreateAccountRequest,
  AccountType,
} from '../../../../../../shared/models/accounts/accounts.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import * as selectors from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    const mockApiService = {
      getCurrencies: vi.fn().mockReturnValue(of(['GEL', 'USD'])),
    };

    await TestBed.configureTestingModule({
      imports: [Accounts, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectors.selectAccountsGrouped, value: {} },
            { selector: selectors.selectIsLoading, value: false },
            { selector: selectors.selectIsCreating, value: false },
            { selector: selectors.selectCreateError, value: null },
            { selector: selectors.selectIsCreateModalOpen, value: false },
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

  it('should create and handle ngOnInit', () => {
    expect(component).toBeTruthy();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(router, 'url', 'get').mockReturnValue(
      '/bank/products/accounts/create',
    );
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.openCreateModal());
  });

  it('should handle account creation transitions', () => {
    component['wasCreating'] = true;
    store.overrideSelector(selectors.selectCreateError, null);
    store.refreshState();
    component['handleIsCreatingAccount'](false);
    expect(component['showCreateAlert']()).toBe(true);
    expect(component['showCreateErrorAlert']()).toBe(false);

    component['wasCreating'] = true;
    store.overrideSelector(selectors.selectCreateError, 'Error message');
    store.refreshState();
    component['handleIsCreatingAccount'](false);
    expect(component['showCreateErrorAlert']()).toBe(true);
  });

  it('should handle create account and form validation', () => {
    fixture.detectChanges();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const navigateSpy = vi.spyOn(router, 'navigate');
    const mockRequest: CreateAccountRequest = {
      friendlyName: 'Savings Account',
      type: AccountType.saving,
      currency: 'USD',
    };

    component['accountForm']().setValue({
      friendlyName: 'Savings Account',
      type: AccountType.saving,
      currency: 'USD',
    });
    component.handleCreateAccount(mockRequest);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.createAccount({ request: mockRequest }),
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/accounts']);

    dispatchSpy.mockClear();
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

  it('should dismiss alerts and handle transfer/retry', () => {
    component.handleAlertDismissed();
    expect(component['showSuccessAlert']()).toBe(false);
    component.handleCreateAlertDismissed();
    expect(component['showCreateAlert']()).toBe(false);
    component.handleCreateErrorAlertDismissed();
    expect(component['showCreateErrorAlert']()).toBe(false);

    const mockAccount = {
      id: 'acc-123',
      userId: 'user-1',
      permission: 1,
      type: AccountType.current,
      iban: 'GE89NB0000000123456789',
      friendlyName: 'Test Account',
      name: 'Test Account',
      status: 'active',
      balance: 1000,
      currency: 'USD',
      createdAt: '2026-01-01',
      openedAt: '2026-01-01',
      closedAt: '',
      isFavorite: false,
      isHidden: false,
    };
    store.overrideSelector(selectors.selectAccounts, [mockAccount]);
    store.refreshState();

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.handleTransfer('acc-123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.selectAccount({ account: mockAccount }),
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal']);

    component.handleRetry();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.loadAccounts({ forceRefresh: true }),
    );
  });
});
