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
  tap,
} from 'rxjs/operators';
import * as CardsActions from './cards.actions';
import { CardListApiService } from '@tia/shared/services/cards/card-list.service.api';
import { Store } from '@ngrx/store';
import {
  selectAccountById,
  selectAccountsLoaded,
  selectAllAccounts,
  selectCardCategories,
  selectCardCreationDataLoaded,
  selectCardDesigns,
  selectCardDetailById,
  selectCardDetails,
  selectCardTypes,
  selectIsCardDetailLoaded,
  selectLoadedCardImageIds,
  selectOtpRemainingAttempts,
} from './cards.selectors';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardsService } from '../../../features/bank/products/components/cards/service/cards.service';
import { TransactionApiService } from '@tia/shared/services/transactions-service/transactions.api.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import * as CardsAlerts from '../../../features/bank/products/components/cards/utils/cards.utils';
@Injectable()
export class CardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly cardListApiService = inject(CardListApiService);
  private readonly cardsService = inject(CardsService);
  private readonly store = inject(Store);
  private readonly transactionApiService = inject(TransactionApiService);
  private readonly alertService = inject(AlertService);
  private readonly translate = inject(TranslateService);
  loadCardAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardAccounts),
      switchMap(({ forceRefresh = false }) =>
        combineLatest([
          this.store.select(selectAccountsLoaded),
          this.store.select(selectAllAccounts),
        ]).pipe(
          take(1),
          switchMap(([isLoaded, accounts]) => {
            if (isLoaded && !forceRefresh) {
              return of(CardsActions.loadCardAccountsSuccess({ accounts }));
            }
            return this.cardListApiService.getCardAccounts().pipe(
              map((accounts) =>
                CardsActions.loadCardAccountsSuccess({ accounts }),
              ),
              catchError((error) =>
                of(
                  CardsActions.loadCardAccountsFailure({
                    error: error.message,
                  }),
                ),
              ),
            );
          }),
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

        return this.store.select(selectLoadedCardImageIds).pipe(
          take(1),
          switchMap((loadedIds) => {
            const unloadedCardIds = allCardIds.filter(
              (cardId) => !loadedIds.includes(cardId),
            );

            if (unloadedCardIds.length === 0) {
              return of(CardsActions.loadCardImagesComplete());
            }

            return forkJoin(
              unloadedCardIds.map((cardId) =>
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
        );
      }),
    ),
  );
  loadCardDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardDetails),
      mergeMap(({ cardId, forceRefresh = false }) =>
        combineLatest([
          this.store.select(selectIsCardDetailLoaded(cardId)),
          this.store.select(selectCardDetails),
        ]).pipe(
          take(1),
          switchMap(([isLoaded, allDetails]) => {
            if (isLoaded && !forceRefresh) {
              const details = allDetails[cardId];
              return of(
                CardsActions.loadCardDetailsSuccess({ cardId, details }),
              );
            }
            return this.cardListApiService.getCardDetails(cardId).pipe(
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
            );
          }),
        ),
      ),
    ),
  );
  loadCardCreationData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.loadCardCreationData),
      switchMap(({ forceRefresh = false }) =>
        combineLatest([
          this.store.select(selectCardCreationDataLoaded),
          this.store.select(selectCardDesigns),
          this.store.select(selectCardCategories),
          this.store.select(selectCardTypes),
        ]).pipe(
          take(1),
          switchMap(([isLoaded, designs, categories, types]) => {
            if (isLoaded && !forceRefresh) {
              return of(
                CardsActions.loadCardCreationDataSuccess({
                  designs,
                  categories,
                  types,
                }),
              );
            }
            return forkJoin({
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
error: error.message || this.translate.instant('my-products.card.errors.failedToLoadCreationData')
                  }),
                ),
              ),
            );
          }),
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
error: error.message || this.translate.instant('my-products.card.errors.failedToCreateCard')
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
      map(() => CardsActions.loadCardAccounts({ forceRefresh: true })),
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
              actions.push(CardsActions.loadCardAccounts({}));
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

  loadCardCreationDataOnModalOpen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.openCreateCardModal),
      map(() => CardsActions.loadCardCreationData({})),
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
error: error.message || this.translate.instant('my-products.card.errors.failedToUpdateCardName')
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
error: error.message || this.translate.instant('my-products.card.errors.failedToRequestOtp')
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
            const errorMessage =
             error.status === 400 || error.error?.message === 'Invalid OTP'
  ? this.translate.instant('my-products.card.errors.otpNotCorrect')
  : error.error?.message || error.message || this.translate.instant('my-products.card.errors.failedToVerifyOtp')
            return of(
              CardsActions.verifyCardOtpFailure({ error: errorMessage }),
            );
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


showOtpSentAlert$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(CardsActions.requestCardOtpSuccess),
      tap(() => CardsAlerts.showOtpSentAlert(this.alertService, this.translate))
    ),
  { dispatch: false },
);

showOtpVerifiedAlert$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(CardsActions.verifyCardOtpSuccess),
      tap(() => CardsAlerts.showOtpVerifiedAlert(this.alertService, this.translate))
    ),
  { dispatch: false },
);

showOtpErrorAlert$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(CardsActions.verifyCardOtpFailure),
      switchMap(({ error }) =>
        this.store.select(selectOtpRemainingAttempts).pipe(
          take(1),
          tap((attempts) => {
            if (attempts === 0) {
              this.store.dispatch(CardsActions.closeCardOtpModal());
            } else {
              CardsAlerts.showOtpErrorAlert(this.alertService, this.translate, error, attempts);
            }
          })
        )
      )
    ),
  { dispatch: false },
);

createCardSuccessAlert$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CardsActions.createCardSuccess),

    tap(() => CardsAlerts.showCardCreatedAlert(this.alertService, this.translate))
  ),
  { dispatch: false }
);

}
