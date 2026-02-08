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
  selectOtpRemainingAttempts,
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
          return of(CardsActions.loadCardImagesComplete());
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
        ).pipe(
          mergeMap((actions) => [
            ...actions,
            CardsActions.loadCardImagesComplete(),
          ]),
        );
      }),
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

  updateCardName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.updateCardName),
      switchMap(({ cardId, cardName }) =>
        this.cardsService.updateCardName(cardId, cardName).pipe(
          map(() => CardsActions.updateCardNameSuccess({ cardId, cardName })),
          catchError((error) =>
            of(
              CardsActions.updateCardNameFailure({
                cardId,
                error: error.message || 'Failed to update card name',
              }),
            ),
          ),
        ),
      ),
    ),
  );
  requestCardOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.requestCardOtp),
      switchMap(({ cardId }) =>
        this.cardsService.requestCardOtp(cardId).pipe(
          map((response) =>
            CardsActions.requestCardOtpSuccess({
              challengeId: response.challengeId,
            }),
          ),
          catchError((error) =>
            of(
              CardsActions.requestCardOtpFailure({
                error: error.message || 'Failed to request OTP',
              }),
            ),
          ),
        ),
      ),
    ),
  );

verifyCardOtp$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CardsActions.verifyCardOtp),
    switchMap(({ challengeId, code, cardId }) =>
      this.cardsService.verifyCardOtp({ challengeId, code }).pipe(
        map((sensitiveData) =>
          CardsActions.verifyCardOtpSuccess({ cardId, sensitiveData }),
        ),
        catchError((error) => {
          const errorMessage = error.status === 400 || error.error?.message === 'Invalid OTP' 
            ? 'OTP code is not correct' 
            : error.error?.message || error.message || 'Failed to verify OTP';
          return of(CardsActions.verifyCardOtpFailure({ error: errorMessage }));
        }),
      ),
    ),
  ),
);
  openCardOtpModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.openCardOtpModal),
      map(({ cardId }) => CardsActions.requestCardOtp({ cardId })),
    ),
  );
  showOtpSentAlert$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CardsActions.requestCardOtpSuccess),
    map(() => CardsActions.showGlobalAlert({ message: 'OTP sent successfully', alertType: 'success' })),
  ),
);

showOtpVerifiedAlert$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CardsActions.verifyCardOtpSuccess),
    map(() => CardsActions.showGlobalAlert({ message: 'Card details retrieved successfully', alertType: 'success' })),
  ),
);

showOtpErrorAlert$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CardsActions.verifyCardOtpFailure),
    switchMap(({ error }) =>
      this.store.select(selectOtpRemainingAttempts).pipe(
        take(1),
        mergeMap((attempts) => {
          const message = attempts > 0 
            ? `${error} (Remaining attempts: ${attempts})`
            : error;
          
          if (attempts === 0) {
            return [
              CardsActions.showGlobalAlert({ message, alertType: 'error' }),
              CardsActions.closeCardOtpModal()
            ];
          }
          
          return [CardsActions.showGlobalAlert({ message, alertType: 'error' })];
        }),
      ),
    ),
  ),
);
hideAlertAfterDelay$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CardsActions.showGlobalAlert),
    delay(3000),
    map(() => CardsActions.hideGlobalAlert()),
  ),
);

}
