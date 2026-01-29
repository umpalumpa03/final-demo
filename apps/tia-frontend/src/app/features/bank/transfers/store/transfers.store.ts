import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { initialTransferState } from './transfers.state';
import { RecipientType } from '../models/transfers.state.model';

export const TransferStore = signalStore(
  withState(initialTransferState),
  withMethods((store) => ({
    //phone or iban
    setRecipientInput(input: string) {
      patchState(store, { recipientInput: input });
    },
    //same or other bank

    setRecipientType(type: RecipientType | null) {
      patchState(store, { recipientType: type });
    },

    setError(error: string | null) {
      patchState(store, { error });
    },

    reset() {
      patchState(store, initialTransferState);
    },
  })),
);
