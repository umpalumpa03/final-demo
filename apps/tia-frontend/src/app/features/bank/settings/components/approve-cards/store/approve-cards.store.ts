import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { initialApproveCardsState } from './approve-cards.state';
import { computed, inject } from '@angular/core';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, filter, of, pipe, switchMap, tap } from 'rxjs';
import { UpdateCardStatusRequest } from '../../../shared/models/approve-models/cards-models/approve-cards.model';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

export const ApproveCardsStore = signalStore(
  withState(initialApproveCardsState),

  withComputed((store) => ({
    count: computed(() => store.cards().length),
  })),

  withMethods(
    (
      store,
      service = inject(ApproveCardsService),
      alertService = inject(AlertService),
      translate = inject(TranslateService),
    ) => ({
      load: rxMethod<void>(
        pipe(
          tap(() => {
            if (store.cards().length === 0) {
              patchState(store, { isLoading: true, error: null });
            }
          }),
          filter(() => store.cards().length === 0),
          switchMap(() =>
            service.getPendingCards().pipe(
              tap((cards) => patchState(store, { cards, isLoading: false })),
              catchError((err) => {
                patchState(store, { error: err.message, isLoading: false });
                return of([]);
              }),
            ),
          ),
        ),
      ),
      loadPermissions: rxMethod<void>(
        pipe(
          tap(() => {
            if (store.permissions().length === 0) {
              patchState(store, { isPermissionsLoading: true, error: null });
            }
          }),
          filter(() => store.permissions().length === 0),
          switchMap(() =>
            service.getCardPermissions().pipe(
              tap((permissions) =>
                patchState(store, { permissions, isPermissionsLoading: false }),
              ),
              catchError((err) => {
                patchState(store, {
                  isPermissionsLoading: false,
                  error: err.message,
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      updateStatus: rxMethod<UpdateCardStatusRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((request) =>
            service.changeCardStatus(request).pipe(
              tap(() => {
                const remainingCards = store
                  .cards()
                  .filter((card) => card.id !== request.cardId);

                patchState(store, {
                  cards: remainingCards,
                  isLoading: false,
                  error: null,
                });

                alertService.success(
                  translate.instant(
                    'settings.approve-cards.alertMessages.successDesc',
                  ),
                  { variant: 'dismissible', title: 'Success!' },
                );
              }),
              catchError((err) => {
                patchState(store, { isLoading: false, error: err.message });

                alertService.error(
                  translate.instant(
                    'settings.approve-cards.alertMessages.errorDesc',
                  ),
                  { variant: 'dismissible', title: 'Oops!' },
                );
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
      clearCache: () => {
        patchState(store, {
          cards: [],
          permissions: [],
          error: null,
        });
      },
    }),
  ),
);
