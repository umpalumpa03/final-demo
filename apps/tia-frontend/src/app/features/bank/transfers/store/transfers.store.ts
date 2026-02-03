import {
  signalStore,
  withState,
  withMethods,
  patchState,
  // withHooks,
  // getState,
} from '@ngrx/signals';
import { initialTransferState } from './transfers.state';
import {
  RecipientType,
  RecipientResponse,
} from '../models/transfers.state.model';
import { effect, inject } from '@angular/core';
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
        ...initialTransferState,
        recipientInput: input,
        recipientType: type,
      });
    },
    //for otherbank transfer
    setManualRecipientName(name: string) {
      patchState(store, { manualRecipientName: name });
    },
    //senders accoutn
    setSenderAccount(account: Account | null) {
      patchState(store, { senderAccount: account });
    },
    //reciipents
    setSelectedRecipientAccount(account: RecipientAccount | null) {
      patchState(store, { selectedRecipientAccount: account });
    },
    //amoutn written by user tobe transfered
    setAmount(amount: number) {
      patchState(store, { amount });
    },
    //description sent with transfer
    setDescription(description: string) {
      patchState(store, { description });
    },
    //update fee indepemdentpy and total amount with fee which needs to be charged from account
    updateFeeInfo(fee: number, totalWithFee: number) {
      patchState(store, { fee, totalWithFee, isLoading: false });
    },
    //flag if balance is insufficient
    setInsufficientBalance(hasInsufficientBalance: boolean) {
      patchState(store, { hasInsufficientBalance });
    },
    //if verified already no more success messages
    setIsVerified(isVerified: boolean) {
      patchState(store, { isVerified });
    },
    setLoading(isLoading: boolean) {
      patchState(store, { isLoading });
    },
    setChallengeId(challengeId: string | null) {
      patchState(store, { challengeId });
    },
    setRequiresOtp(requiresOtp: boolean) {
      patchState(store, { requiresOtp });
    },
    setTransferSuccess(transferSuccess: boolean) {
      patchState(store, { transferSuccess });
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
  // withHooks({
  //   onInit(store) {
  //     effect(() => {
  //       const state = getState(store);
  //       console.log(' stateeee', state);
  //     });
  //   },
  // }),
);
