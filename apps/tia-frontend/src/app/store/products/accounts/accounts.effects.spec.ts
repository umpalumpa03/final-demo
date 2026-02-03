import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Action } from '@ngrx/store';
import { AccountsEffects } from './accounts.effects';
import { AccountsActions } from './accounts.actions';
import {
  Account,
  AccountType,
} from '../../../shared/models/accounts/accounts.model';
import { AccountsApiService } from '../../../shared/services/accounts/accounts.api.service';

describe('AccountsEffects', () => {
  let actions$: Observable<Action>;
  let effects: AccountsEffects;
  let service: AccountsApiService;

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
  };

  beforeEach(() => {
    const serviceMock = {
      getAccounts: vi.fn(),
      createAccount: vi.fn(),
      updateFriendlyName: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        { provide: AccountsApiService, useValue: serviceMock },
      ],
    });

    effects = TestBed.inject(AccountsEffects);
    service = TestBed.inject(AccountsApiService);
  });

  describe('loadAccounts$', () => {
    it('should return loadAccountsSuccess on success', () => {
      vi.spyOn(service, 'getAccounts').mockReturnValue(of([mockAccount]));
      actions$ = of(AccountsActions.loadAccounts());

      let result: Action | undefined;
      effects.loadAccounts$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.loadAccountsSuccess({ accounts: [mockAccount] }),
      );
    });

    it('should return loadAccountsFailure on error', () => {
      vi.spyOn(service, 'getAccounts').mockReturnValue(
        throwError(() => new Error('Test error')),
      );
      actions$ = of(AccountsActions.loadAccounts());

      let result: Action | undefined;
      effects.loadAccounts$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.loadAccountsFailure({ error: 'Test error' }),
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
        throwError(() => new Error('Create error')),
      );
      actions$ = of(AccountsActions.createAccount({ request }));

      let result: Action | undefined;
      effects.createAccount$.subscribe((action) => (result = action));
      expect(result).toEqual(
        AccountsActions.createAccountFailure({ error: 'Create error' }),
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
        throwError(() => new Error('Update error')),
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
        AccountsActions.updateFriendlyNameFailure({ error: 'Update error' }),
      );
    });
  });
});
