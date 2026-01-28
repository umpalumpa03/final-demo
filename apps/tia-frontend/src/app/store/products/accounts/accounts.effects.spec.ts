import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountsEffects } from './accounts.effects';
import { AccountsActions } from './accounts.actions';
import { AccountsService } from '../../../shared/services/accounts/accounts.service';

describe('AccountsEffects', () => {
  let effects: AccountsEffects;
  let actions$: Observable<unknown>;

  beforeEach(() => {
    const accountsServiceMock = {
      getAccounts: () => of([]),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        { provide: AccountsService, useValue: accountsServiceMock },
      ],
    });
    effects = TestBed.inject(AccountsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should dispatch loadAccountsFailure on error', async () => {
    const error = new Error('Test error');
    const accountsServiceMock = {
      getAccounts: () => throwError(() => error),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AccountsEffects,
        provideMockActions(() => actions$),
        { provide: AccountsService, useValue: accountsServiceMock },
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
});
