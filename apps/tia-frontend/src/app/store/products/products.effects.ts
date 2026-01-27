import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AccountsService } from '../../features/bank/products/components/accounts/services/accounts.service';
import { ProductsActions } from './products.actions';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountsService = inject(AccountsService);

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadAccounts),
      switchMap(() =>
        this.accountsService.getAccounts().pipe(
          map((accounts) => {
            return ProductsActions.loadAccountsSuccess({ accounts });
          }),
          catchError((error) =>
            of(
              ProductsActions.loadAccountsFailure({
                error: error.message || 'Failed to load accounts',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
