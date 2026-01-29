import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountsEffects } from './accounts.effects';
import { AccountsActions } from './accounts.actions';
import { AccountsService } from '../../../shared/services/accounts/accounts.service';
import {
  Account,
  AccountType,
} from '../../../shared/models/accounts/accounts.model';

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
          provide: AccountsService,
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
          provide: AccountsService,
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
          provide: AccountsService,
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
});
