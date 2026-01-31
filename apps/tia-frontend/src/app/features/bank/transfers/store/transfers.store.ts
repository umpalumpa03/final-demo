import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { initialTransferState } from './transfers.state';
import {
  RecipientType,
  RecipientResponse,
} from '../models/transfers.state.model';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { TransfersApiService } from '../services/transfersApi.service';

export const TransferStore = signalStore(
  withState(initialTransferState),

  withMethods((store, transfersApi = inject(TransfersApiService)) => ({
    setExternalRecipient(input: string, type: RecipientType) {
      patchState(store, {
        recipientInput: input,
        recipientType: type,
        recipientInfo: null,
        error: null,
      });
    },
    setManualRecipientName(name: string) {
      patchState(store, { manualRecipientName: name });
    },

    lookupRecipient: rxMethod<{ value: string; type: RecipientType }>(
      pipe(
        tap(({ value, type }) =>
          patchState(store, {
            recipientInput: value,
            recipientType: type,
            isLoading: true,
            error: null,
            recipientInfo: null,
          }),
        ),
        switchMap(({ value, type }) => {
          const lookup$ =
            type === 'phone'
              ? transfersApi.lookupByPhone(value)
              : transfersApi.lookupByIban(value);

          return lookup$.pipe(
            tap((response: RecipientResponse) => {
              patchState(store, {
                recipientInfo: response,
                isLoading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message || 'Failed to find recipient',
                isLoading: false,
                recipientInfo: null,
              });
              return of(null);
            }),
          );
        }),
      ),
    ),

    reset() {
      patchState(store, initialTransferState);
    },
  })),
);
