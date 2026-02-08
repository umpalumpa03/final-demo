import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { initialApproveCardsState } from './approve-cards.state';
import { computed, inject } from '@angular/core';
import { ApproveCardsService } from '../shared/services/approve-cards.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { UpdateCardStatusRequest } from '../shared/model/approve-cards.model';

export const ApproveCardsStore = signalStore(
  withState(initialApproveCardsState),

  withComputed((store) => ({
    count: computed(() => store.cards().length),
  })),

  withMethods((store, service = inject(ApproveCardsService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          service.getPendingCards().pipe(
            tap((card) => {
              patchState(store, { cards: card, isLoading: false });
            }),
            catchError((err) => {
              patchState(store, { error: err.message, isLoading: false });
              return of([]);
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
               success: 'success',
              });

              setTimeout(() => {
                patchState(store, { success: null });
              }, 4000);
            }),
          ),
        ),
      ),
    ),

    loadPerrmisions: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          service.getCardPermissions().pipe(
            tap((permissions) => {
              patchState(store, {
                permissions,
                isLoading: false,
                error: null,
              });
            }),
            catchError((err) => {
              patchState(store, { isLoading: false, error: err.message });
              return of([]);
            }),
          ),
        ),
      ),
    ),
  })),
);
