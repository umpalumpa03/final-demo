import { transfersReducer } from './transfers-repeat.reducer';
import { TransfersRepeatActions } from './transfers-repeat.actions';
import { transfersInitialState } from './config/transfers-repeat.state';
import { describe, it, expect } from 'vitest';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

describe('Transfers Repeat Reducer', () => {
  const mockTransaction: ITransactions = {
    id: 'tx-123',
    amount: 100,
    currency: 'GEL',
    description: 'Test Transaction',
  } as any;

  it('should return the default state for unknown action', () => {
    const action = { type: 'Unknown' } as any;
    const state = transfersReducer(transfersInitialState, action);

    expect(state).toBe(transfersInitialState);
  });

  it('should set transactionToRepeat on setTransactionToRepeat action', () => {
    const action = TransfersRepeatActions.setTransactionToRepeat({
      transaction: mockTransaction,
    });
    const state = transfersReducer(transfersInitialState, action);

    expect(state.transactionToRepeat).toEqual(mockTransaction);
  });

  it('should set transactionToRepeat to null on clearTransactionToRepeat action', () => {
    const dirtyState = {
      ...transfersInitialState,
      transactionToRepeat: mockTransaction,
    };

    const action = TransfersRepeatActions.clearTransactionToRepeat();
    const state = transfersReducer(dirtyState, action);

    expect(state.transactionToRepeat).toBeNull();
  });
});
