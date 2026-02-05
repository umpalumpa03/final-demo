import { selectTransactionToRepeat } from './transfers-repeat.selectors';
import { TransfersState } from './config/transfers-repeat.state';
import { describe, it, expect } from 'vitest';

describe('Transfers Repeat Selectors', () => {
  const mockTransaction = { id: '123', amount: 50 } as any;

  const initialState: TransfersState = {
    transactionToRepeat: mockTransaction,
    isLoading: false,
    error: null,
  };

  it('should select transactionToRepeat', () => {
    const result = selectTransactionToRepeat.projector(initialState);
    expect(result).toEqual(mockTransaction);
    expect(result?.id).toBe('123');
  });
  it('should return null if transactionToRepeat is null', () => {
    const emptyState: TransfersState = {
      ...initialState,
      transactionToRepeat: null,
    };
    const result = selectTransactionToRepeat.projector(emptyState);
    expect(result).toBeNull();
  });
});
