import { loansReducer } from './loans.reducer';
import { LoansActions } from './loans.actions';
import { describe, it, expect } from 'vitest';
import { ILoan, LoansState } from '../shared/models/loan.model';

describe('LoansReducer', () => {
  const initialState: LoansState = {
    loans: [],
    loading: false,
    error: null,
    filterStatus: null,
  };

  const mockLoan: ILoan = {
    id: '1',
    loanAmount: 1000,
    accountId: 'acc-1',
    months: 12,
    purpose: 'Test',
    status: 1,
    statusName: 'Pending',
    monthlyPayment: 100,
    nextPaymentDate: null,
    createdAt: '2025-01-01',
    friendlyName: 'Test Loan',
  };

  it('should return the default state on unknown action', () => {
    const action = { type: 'Unknown' };
    const state = loansReducer(initialState, action as any);
    expect(state).toBe(initialState);
  });

  it('should set loading to true on loadLoans', () => {
    const action = LoansActions.loadLoans();
    const state = loansReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update loans and loading on loadLoansSuccess', () => {
    const mockLoans: ILoan[] = [mockLoan];
    const action = LoansActions.loadLoansSuccess({ loans: mockLoans });
    const state = loansReducer({ ...initialState, loading: true }, action);

    expect(state.loans).toEqual(mockLoans);
    expect(state.loading).toBe(false);
  });

  it('should update filterStatus on setFilter', () => {
    const action = LoansActions.setFilter({ status: 2 });
    const state = loansReducer(initialState, action);

    expect(state.filterStatus).toBe(2);
  });

  it('should handle renameLoanSuccess', () => {
    const stateWithLoan = { ...initialState, loans: [mockLoan] };
    const action = LoansActions.renameLoanSuccess({
      id: '1',
      name: 'New Name',
    });
    const state = loansReducer(stateWithLoan, action);

    expect(state.loans[0].friendlyName).toBe('New Name');
  });

  it('should not update rename if id not found', () => {
    const stateWithLoan = {
      ...initialState,
      loans: [{ ...mockLoan, friendlyName: 'Old Name' }],
    };

    const action = LoansActions.renameLoanSuccess({
      id: '999',
      name: 'New Name',
    });
    const state = loansReducer(stateWithLoan, action);

    expect(state.loans[0].friendlyName).toBe('Old Name');
  });
});
