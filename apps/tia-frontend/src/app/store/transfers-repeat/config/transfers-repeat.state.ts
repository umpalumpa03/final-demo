import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

export const TRANSFERS_FEATURE_KEY = 'TransfersRepeat';

export interface TransfersState {
  transactionToRepeat: ITransactions | null;
  isLoading: boolean;
  error: string | null;
}

export const transfersInitialState: TransfersState = {
  transactionToRepeat: null,
  isLoading: false,
  error: null,
};
