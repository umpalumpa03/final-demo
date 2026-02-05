import { createReducer, on } from '@ngrx/store';
import { TransfersRepeatActions } from './transfers-repeat.actions';
import { transfersInitialState } from './config/transfers-repeat.state';

export const transfersReducer = createReducer(
  transfersInitialState,

  on(
    TransfersRepeatActions.setTransactionToRepeat,
    (state, { transaction }) => ({
      ...state,
      transactionToRepeat: transaction,
    }),
  ),

  on(TransfersRepeatActions.clearTransactionToRepeat, (state) => ({
    ...state,
    transactionToRepeat: null,
  })),
);
