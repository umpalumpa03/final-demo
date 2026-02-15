import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Action } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { AccountsEffects } from './accounts.effects';
import { AccountsActions } from './accounts.actions';
import { selectAccounts } from './accounts.selectors';
import {
  Account,
  AccountType,
} from '../../../shared/models/accounts/accounts.model';
import { AccountsApiService } from '../../../shared/services/accounts/accounts.api.service';
import { AlertService } from '../../../core/services/alert/alert.service';

describe('AccountsEffects', () => {
  let actions$: Observable<Action>;
  let effects: AccountsEffects;
  let service: AccountsApiService;
  let store: MockStore;

  const mockAccount: Account = {
    id: '1',
    userId: 'user-1',
    permission: 1,
    friendlyName: 'Test',
    type: AccountType.current,
    balance: 1000,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-01-01',
    iban: 'GE89NB0000000123456789',
    name: 'Test',
    openedAt: '2026-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
  };

  beforeEach(() => {
    const serviceMock = {
      getAccounts: vi.fn(),
      getActiveAccounts: vi.fn(),
      createAccount: vi.fn(),
      updateFriendlyName: vi.fn(),
      getCurrencies: vi.fn(),
    };

    const translateMock = {
      instant: vi.fn((key: string) => key),
    };

    const alertServiceMock = {
      info: vi.fn(),
      error: vi.fn(),
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectAccounts, value: [] }],
        }),
        { provide: AccountsApiService, useValue: serviceMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    });

    effects = TestBed.inject(AccountsEffects);
    service = TestBed.inject(AccountsApiService);
    store = TestBed.inject(MockStore);
  });

  describe('loadAccounts$', () => {
    it('should return loadAccountsSuccess when store is empty', () => {
      vi.spyOn(service, 'getAccounts').mockReturnValue(of([mockAccount]));
      actions$ = of(AccountsActions.loadAccounts({ forceRefresh: false }));

      let result: Action | undefined;
      effects.loadAccounts$.subscribe((action) => (result = action));

      expect(service.getAccounts).toHaveBeenCalled();
      expect(result).toEqual(
        AccountsActions.loadAccountsSuccess({ accounts: [mockAccount] }),
      );
    });

    it('should NOT call API if store has data and forceRefresh is false', () => {
      store.overrideSelector(selectAccounts, [mockAccount]);
      const spy = vi.spyOn(service, 'getAccounts');
      actions$ = of(AccountsActions.loadAccounts({ forceRefresh: false }));

      let result: Action | undefined;
      effects.loadAccounts$.subscribe((action) => (result = action));

      expect(spy).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return loadAccountsFailure on error', () => {
      vi.spyOn(service, 'getAccounts').mockReturnValue(throwError(() => ({})));
      actions$ = of(AccountsActions.loadAccounts({ forceRefresh: true }));

      let result: Action | undefined;
      effects.loadAccounts$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.loadAccountsFailure({
          error: 'Failed to load accounts',
        }),
      );
    });
  });

  describe('loadActiveAccounts$', () => {
    it('should return loadActiveAccountsSuccess when store is empty', () => {
      vi.spyOn(service, 'getActiveAccounts').mockReturnValue(of([mockAccount]));
      actions$ = of(
        AccountsActions.loadActiveAccounts({ forceRefresh: false }),
      );

      let result: Action | undefined;
      effects.loadActiveAccounts$.subscribe((action) => (result = action));

      expect(service.getActiveAccounts).toHaveBeenCalled();
      expect(result).toEqual(
        AccountsActions.loadActiveAccountsSuccess({ accounts: [mockAccount] }),
      );
    });

    it('should NOT call API if store has data and forceRefresh is false', () => {
      store.overrideSelector(selectAccounts, [mockAccount]);
      const spy = vi.spyOn(service, 'getActiveAccounts');
      actions$ = of(
        AccountsActions.loadActiveAccounts({ forceRefresh: false }),
      );

      let result: Action | undefined;
      effects.loadActiveAccounts$.subscribe((action) => (result = action));

      expect(spy).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return loadActiveAccountsFailure on error', () => {
      vi.spyOn(service, 'getActiveAccounts').mockReturnValue(
        throwError(() => ({})),
      );
      actions$ = of(AccountsActions.loadActiveAccounts({ forceRefresh: true }));

      let result: Action | undefined;
      effects.loadActiveAccounts$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.loadActiveAccountsFailure({
          error: 'Failed to load accounts',
        }),
      );
    });
  });

  describe('createAccount$', () => {
    it('should return createAccountSuccess on success', () => {
      const request = {
        friendlyName: 'New',
        type: AccountType.saving,
        currency: 'USD',
      };
      vi.spyOn(service, 'createAccount').mockReturnValue(of(mockAccount));
      actions$ = of(AccountsActions.createAccount({ request }));

      let result: Action | undefined;
      effects.createAccount$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.createAccountSuccess({ account: mockAccount }),
      );
    });

    it('should return createAccountFailure on error', () => {
      const request = {
        friendlyName: 'New',
        type: AccountType.saving,
        currency: 'USD',
      };
      vi.spyOn(service, 'createAccount').mockReturnValue(
        throwError(() => ({})),
      );
      actions$ = of(AccountsActions.createAccount({ request }));

      let result: Action | undefined;
      effects.createAccount$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.createAccountFailure({
          error: 'Failed to create account',
        }),
      );
    });
  });

  describe('updateFriendlyName$', () => {
    it('should return updateFriendlyNameSuccess on success', () => {
      const updatedAccount = { ...mockAccount, friendlyName: 'Updated' };
      vi.spyOn(service, 'updateFriendlyName').mockReturnValue(
        of(updatedAccount),
      );
      actions$ = of(
        AccountsActions.updateFriendlyName({
          accountId: '1',
          friendlyName: 'Updated',
        }),
      );

      let result: Action | undefined;
      effects.updateFriendlyName$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.updateFriendlyNameSuccess({ account: updatedAccount }),
      );
    });

    it('should return updateFriendlyNameFailure on error', () => {
      vi.spyOn(service, 'updateFriendlyName').mockReturnValue(
        throwError(() => ({})),
      );
      actions$ = of(
        AccountsActions.updateFriendlyName({
          accountId: '1',
          friendlyName: 'Updated',
        }),
      );

      let result: Action | undefined;
      effects.updateFriendlyName$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.updateFriendlyNameFailure({
          error: 'Failed to update friendly name',
        }),
      );
    });
  });

  describe('loadCurrencies$', () => {
    it('should load currencies when store is empty', () => {
      const mockCurrencies = ['USD', 'EUR', 'GBP'];
      vi.spyOn(service, 'getCurrencies').mockReturnValue(of(mockCurrencies));
      actions$ = of(AccountsActions.loadCurrencies());

      let result: Action | undefined;
      effects.loadCurrencies$.subscribe((action) => (result = action));

      expect(service.getCurrencies).toHaveBeenCalled();
      expect(result).toEqual(
        AccountsActions.loadCurrenciesSuccess({ currencies: mockCurrencies }),
      );
    });

    it('should return loadCurrenciesFailure on error', () => {
      vi.spyOn(service, 'getCurrencies').mockReturnValue(
        throwError(() => ({})),
      );
      actions$ = of(AccountsActions.loadCurrencies());

      let result: Action | undefined;
      effects.loadCurrencies$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.loadCurrenciesFailure({
          error: 'Failed to load currencies',
        }),
      );
    });
  });
});
