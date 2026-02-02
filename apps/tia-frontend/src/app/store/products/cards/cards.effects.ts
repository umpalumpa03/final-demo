import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, mergeMap, forkJoin, EMPTY } from 'rxjs';
import { map, catchError, switchMap, take } from 'rxjs/operators';
import * as CardsActions from './cards.actions';
import { CardListApiService } from '@tia/shared/services/cards/card-list.service.api';
import { Store } from '@ngrx/store';
import { selectAllAccounts } from './cards.selectors';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardsService } from '../../../features/bank/products/components/cards/service/cards.service';

@Injectable()
export class CardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly cardListApiService = inject(CardListApiService);
  private readonly cardsService = inject(CardsService);
  private readonly store = inject(Store);

  loadCardAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardAccounts),
      switchMap(() =>
        this.cardListApiService.getCardAccounts().pipe(
          map((accounts) => CardsActions.loadCardAccountsSuccess({ accounts })),
          catchError((error) =>
            of(CardsActions.loadCardAccountsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  loadCardImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardAccountsSuccess),
      switchMap(({ accounts }) => {
        const allCardIds = accounts.flatMap((account) => account.cardIds);

        if (allCardIds.length === 0) {
          return EMPTY;
        }

        return forkJoin(
          allCardIds.map((cardId) =>
            this.cardsService.getCardImage(cardId).pipe(
              map((imageBase64) =>
                CardsActions.loadCardImageSuccess({ cardId, imageBase64 }),
              ),
              catchError(() =>
                of(
                  CardsActions.loadCardImageFailure({
                    cardId,
                    error: 'IMAGE_LOAD_FAILED',
                  }),
                ),
              ),
            ),
          ),
        );
      }),
      mergeMap((actions) => actions),
    ),
  );

  loadCardDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardDetails),
      mergeMap(({ cardId }) =>
        this.cardListApiService.getCardDetails(cardId).pipe(
          map((details) =>
            CardsActions.loadCardDetailsSuccess({ cardId, details }),
          ),
          catchError((error) =>
            of(
              CardsActions.loadCardDetailsFailure({
                cardId,
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadCardCreationData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardCreationData),
      switchMap(() =>
        forkJoin({
          designs: this.cardsService.getCardDesigns(),
          categories: this.cardsService.getCardCategories(),
          types: this.cardsService.getCardTypes(),
        }).pipe(
          map(({ designs, categories, types }) =>
            CardsActions.loadCardCreationDataSuccess({
              designs,
              categories,
              types,
            }),
          ),
          catchError((error) =>
            of(
              CardsActions.loadCardCreationDataFailure({
                error: error.message || 'Failed to load card creation data',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.createCard),
      switchMap(({ request }) =>
        this.cardsService.createCard(request).pipe(
          map(() => CardsActions.createCardSuccess()),
          catchError((error) =>
            of(
              CardsActions.createCardFailure({
                error: error.message || 'Failed to create card',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createCardSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.createCardSuccess),
      map(() => CardsActions.loadCardAccounts()),
    ),
  );

  loadAccountCardsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadAccountCardsPage),
      switchMap(({ accountId }) =>
        this.store.select(selectAllAccounts).pipe(
          take(1),
          switchMap((accounts: CardAccount[]) => {
            const actions = [];

            if (accounts.length === 0) {
              actions.push(CardsActions.loadCardAccounts());
            } else {
              const account = accounts.find((acc) => acc.id === accountId);
              if (account?.cardIds && account.cardIds.length > 0) {
                account.cardIds.forEach((cardId) => {
                  actions.push(CardsActions.loadCardDetails({ cardId }));
                });
              }
            }

            return actions;
          }),
        ),
      ),
    ),
  );
}