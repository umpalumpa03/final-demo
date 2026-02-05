import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TRANSFERS_FEATURE_KEY,
  TransfersState,
} from './config/transfers-repeat.state';

export const selectTransfersState = createFeatureSelector<TransfersState>(
  TRANSFERS_FEATURE_KEY,
);

export const selectTransactionToRepeat = createSelector(
  selectTransfersState,
  (state) => state.transactionToRepeat,
);
