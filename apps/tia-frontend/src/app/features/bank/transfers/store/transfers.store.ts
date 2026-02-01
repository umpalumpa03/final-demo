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
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { RecipientAccount } from '../models/transfers.state.model';

export const TransferStore = signalStore(
  withState(initialTransferState),

  withMethods((store, transfersApi = inject(TransfersApiService)) => ({
    setExternalRecipient(input: string, type: RecipientType) {
      patchState(store, {
        recipientInput: input,
        recipientType: type,
        recipientInfo: null,
        senderAccount: null,
        selectedRecipientAccount: null,
        manualRecipientName: '',
        amount: 0,
        description: '',
        error: null,
      });
    },
    setManualRecipientName(name: string) {
      patchState(store, { manualRecipientName: name });
    },
    setSenderAccount(account: Account | null) {
      patchState(store, { senderAccount: account });
    },
    setSelectedRecipientAccount(account: RecipientAccount | null) {
      patchState(store, { selectedRecipientAccount: account });
    },
    setAmount(amount: number) {
      patchState(store, { amount });
    },
    setDescription(description: string) {
      patchState(store, { description });
    },
    //
    updateFeeInfo(fee: number, totalWithFee: number) {
      patchState(store, { fee, totalWithFee, isLoading: false });
    },

    setLoading(isLoading: boolean) {
      patchState(store, { isLoading });
    },
    setIsVerified(isVerified: boolean) {
      patchState(store, { isVerified });
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
            senderAccount: null,
            selectedRecipientAccount: null,
            amount: 0,
            description: '',
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
                isVerified: true,
              });
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message || 'Failed to find recipient',
                isLoading: false,
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
