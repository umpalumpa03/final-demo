import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, mergeMap, forkJoin, EMPTY, combineLatest } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  take,
  delay,
  filter,
  skip,
} from 'rxjs/operators';
import * as CardsActions from './cards.actions';
import { CardListApiService } from '@tia/shared/services/cards/card-list.service.api';
import { Store } from '@ngrx/store';
import {
  selectAccountById,
  selectAllAccounts,
  selectCardDetailById,
  selectCardDetails,
} from './cards.selectors';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardsService } from '../../../features/bank/products/components/cards/service/cards.service';
import { TransactionApiService } from '@tia/shared/services/transactions-service/transactions.api.service';

@Injectable()
export class CardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly cardListApiService = inject(CardListApiService);
  private readonly cardsService = inject(CardsService);
  private readonly store = inject(Store);
  private readonly transactionApiService = inject(TransactionApiService);

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

  hideSuccessAlertAfterDelay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.createCardSuccess),
      delay(5000),
      map(() => CardsActions.hideSuccessAlert()),
    ),
  );
  loadCardCreationDataOnModalOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.openCreateCardModal),
      map(() => CardsActions.loadCardCreationData()),
    ),
  );

  loadCardTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardTransactions),
      switchMap(({ cardId }) =>
        this.store.select(selectCardDetailById(cardId)).pipe(
          take(1),
          switchMap((cardData) => {
            if (!cardData?.details?.accountId) {
              return of(
                CardsActions.loadCardTransactionsFailure({
                  cardId,
                  error: 'Card details not found',
                }),
              );
            }

            return this.store
              .select(selectAccountById(cardData.details.accountId))
              .pipe(
                take(1),
                switchMap((account) => {
                  if (!account?.iban) {
                    return of(
                      CardsActions.loadCardTransactionsFailure({
                        cardId,
                        error: 'Account IBAN not found',
                      }),
                    );
                  }

                  return this.transactionApiService
                    .getTransactions({
                      accountIban: account.iban,
                      pageLimit: 20,
                    })
                    .pipe(
                      map((response) =>
                        CardsActions.loadCardTransactionsSuccess({
                          cardId,
                          transactions: response.items || [],
                          total: response.items?.length || 0,
                        }),
                      ),
                      catchError((error) =>
                        of(
                          CardsActions.loadCardTransactionsFailure({
                            cardId,
                            error:
                              error.message || 'Failed to load transactions',
                          }),
                        ),
                      ),
                    );
                }),
              );
          }),
        ),
      ),
    ),
  );
  loadCardTransactionsWhenReady$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardDetailsSuccess),
      switchMap(({ cardId }) =>
        combineLatest([
          this.store.select(selectCardDetailById(cardId)).pipe(skip(1)),
          this.store.select(selectAllAccounts),
        ]).pipe(
          take(1),
          switchMap(([cardData, accounts]) => {
            if (!cardData?.details?.accountId || accounts.length === 0) {
              return EMPTY;
            }

            const account = accounts.find(
              (acc) => acc.id === cardData.details.accountId,
            );

            if (account) {
              return of(CardsActions.loadCardTransactions({ cardId }));
            }
            return EMPTY;
          }),
        ),
      ),
    ),
  );
}
