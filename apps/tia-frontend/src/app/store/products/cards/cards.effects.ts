import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, mergeMap, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CardListService } from '../../../features/bank/products/components/cards/services/card-list.service';
import * as CardsActions from './cards.actions';

@Injectable()
export class CardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly cardListService = inject(CardListService);

  loadCardAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardAccounts),
      switchMap(() =>
        this.cardListService.getCardAccounts().pipe(
          map((accounts) =>
            CardsActions.loadCardAccountsSuccess({ accounts })
          ),
          catchError((error) =>
            of(CardsActions.loadCardAccountsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadCardImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardAccountsSuccess),
      mergeMap(({ accounts }) => {
        const allCardIds = accounts.flatMap((account) => account.cardIds);
        
        return allCardIds.map((cardId) =>
          this.cardListService.getCardImage(cardId).pipe(
            map((imageBase64) =>
              CardsActions.loadCardImageSuccess({ cardId, imageBase64 })
            ),
            catchError((error) =>
              of(CardsActions.loadCardImageFailure({ cardId, error: error.message }))
            )
          )
        );
      }),
      mergeMap((observables) => observables)
    )
  );
}