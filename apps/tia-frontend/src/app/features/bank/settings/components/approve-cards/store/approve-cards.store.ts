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
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

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
              console.log('API Response:', card);
              patchState(store, { cards: card, isLoading: false });
            }),
            catchError((err) => {
              patchState(store, { error: err, isLoading: false });
              return of([]);
            }),
          ),
        ),
      ),
    ),
  })),
);
