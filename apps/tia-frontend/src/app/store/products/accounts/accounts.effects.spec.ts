import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountsEffects } from './accounts.effects';
import { AccountsActions } from './accounts.actions';
import {
  Account,
  AccountType,
} from '../../../shared/models/accounts/accounts.model';
import { AccountsApiService } from '../../../shared/services/accounts/accounts.api.service';

describe('AccountsEffects', () => {
  let effects: AccountsEffects;
  let actions$: Observable<unknown>;

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
    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        {
          provide: AccountsApiService,
          useValue: {
            getAccounts: () => of([mockAccount]),
            createAccount: () => of(mockAccount),
          },
        },
      ],
    });
    effects = TestBed.inject(AccountsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should handle loadAccounts success', () => {
    actions$ = of(AccountsActions.loadAccounts());
    return new Promise((resolve) => {
      effects.loadAccounts$.subscribe((result) => {
        expect(result.type).toBe(AccountsActions.loadAccountsSuccess.type);
        resolve(undefined);
      });
    });
  });

  it('should handle loadAccounts failure', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        {
          provide: AccountsApiService,
          useValue: {
            getAccounts: () => throwError(() => new Error('Test error')),
            createAccount: () => of(mockAccount),
          },
        },
      ],
    });
    effects = TestBed.inject(AccountsEffects);
    actions$ = of(AccountsActions.loadAccounts());
    return new Promise((resolve) => {
      effects.loadAccounts$.subscribe((result) => {
        expect(result.type).toBe(AccountsActions.loadAccountsFailure.type);
        resolve(undefined);
      });
    });
  });

  it('should handle createAccount success', () => {
    actions$ = of(
      AccountsActions.createAccount({
        request: {
          friendlyName: 'New',
          type: AccountType.saving,
          currency: 'USD',
        },
      }),
    );
    return new Promise((resolve) => {
      effects.createAccount$.subscribe((result) => {
        expect(result.type).toBe(AccountsActions.createAccountSuccess.type);
        resolve(undefined);
      });
    });
  });

  it('should handle createAccount failure', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        {
          provide: AccountsApiService,
          useValue: {
            getAccounts: () => of([mockAccount]),
            createAccount: () => throwError(() => new Error('Create error')),
          },
        },
      ],
    });
    effects = TestBed.inject(AccountsEffects);
    actions$ = of(
      AccountsActions.createAccount({
        request: {
          friendlyName: 'New',
          type: AccountType.saving,
          currency: 'USD',
        },
      }),
    );
    return new Promise((resolve) => {
      effects.createAccount$.subscribe((result) => {
        expect(result.type).toBe(AccountsActions.createAccountFailure.type);
        resolve(undefined);
      });
    });
  });

  it('should handle updateFriendlyName success', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        {
          provide: AccountsApiService,
          useValue: {
            getAccounts: () => of([mockAccount]),
            createAccount: () => of(mockAccount),
            updateFriendlyName: () =>
              of({ ...mockAccount, friendlyName: 'Updated' }),
          },
        },
      ],
    });
    effects = TestBed.inject(AccountsEffects);
    actions$ = of(
      AccountsActions.updateFriendlyName({
        accountId: '1',
        friendlyName: 'Updated',
      }),
    );
    return new Promise((resolve) => {
      effects.updateFriendlyName$.subscribe((result) => {
        expect(result.type).toBe(
          AccountsActions.updateFriendlyNameSuccess.type,
        );
        resolve(undefined);
      });
    });
  });

  it('should handle updateFriendlyName failure', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        {
          provide: AccountsApiService,
          useValue: {
            getAccounts: () => of([mockAccount]),
            createAccount: () => of(mockAccount),
            updateFriendlyName: () =>
              throwError(() => new Error('Update error')),
          },
        },
      ],
    });
    effects = TestBed.inject(AccountsEffects);
    actions$ = of(
      AccountsActions.updateFriendlyName({
        accountId: '1',
        friendlyName: 'Updated',
      }),
    );
    return new Promise((resolve) => {
      effects.updateFriendlyName$.subscribe((result) => {
        expect(result.type).toBe(
          AccountsActions.updateFriendlyNameFailure.type,
        );
        resolve(undefined);
      });
    });
  });
});
