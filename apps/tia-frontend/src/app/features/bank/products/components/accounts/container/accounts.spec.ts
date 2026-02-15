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
import { TransferService } from '../services/transfer/transfer.service';
import { AlertService } from '@tia/core/services/alert/alert.service';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let store: MockStore;
  let router: Router;
  let alertService: AlertService;

  beforeEach(async () => {
    const mockTransferService = {
      navigateToTransferPage: vi.fn(),
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
            { selector: selectors.selectCurrencies, value: [] },
          ],
        }),
        { provide: TransferService, useValue: mockTransferService },
        {
          provide: AlertService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
            warning: vi.fn(),
            info: vi.fn(),
            showAlert: vi.fn(),
            clearAlert: vi.fn(),
          },
        },
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
    alertService = TestBed.inject(AlertService);
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
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.loadActiveAccounts({ forceRefresh: true }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.loadCurrencies());
    expect(dispatchSpy).toHaveBeenCalledWith(AccountsActions.openCreateModal());
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

  it('should handle transfer and retry', () => {
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
    const transferService = TestBed.inject(TransferService);
    const transferSpy = vi.spyOn(transferService, 'navigateToTransferPage');
    component.handleTransfer({ account: mockAccount, permissionValue: 1 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.selectAccount({ account: mockAccount }),
    );
    expect(transferSpy).toHaveBeenCalledWith('acc-123', 1);

    component.handleRetry();
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.loadActiveAccounts({ forceRefresh: true }),
    );
  });

  it('should use TransferService for transfer routing', () => {
    const mockAccount = {
      id: 'acc-456',
      userId: 'user-1',
      permission: 32,
      type: AccountType.current,
      iban: 'GE89NB0000000456789',
      friendlyName: 'Loans Account',
      name: 'Loans Account',
      status: 'active',
      balance: 5000,
      currency: 'USD',
      createdAt: '2026-01-01',
      openedAt: '2026-01-01',
      closedAt: '',
      isFavorite: false,
      isHidden: false,
    };
    store.overrideSelector(selectors.selectAccounts, [mockAccount]);
    store.refreshState();

    const transferService = TestBed.inject(TransferService);
    const transferSpy = vi.spyOn(transferService, 'navigateToTransferPage');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleTransfer({ account: mockAccount, permissionValue: 32 });
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountsActions.selectAccount({ account: mockAccount }),
    );
    expect(transferSpy).toHaveBeenCalledWith('acc-456', 32);
  });
});
