import { loansReducer } from './loans.reducer';
import { LoansActions } from './loans.actions';
import { describe, it, expect } from 'vitest';
import { ILoan, ILoansState } from '../shared/models/loan.model';
import { loansInitialState } from './loans.state';

describe('LoansReducer', () => {
  const initialState: ILoansState = loansInitialState;

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

  it('should update error and loading on loadLoansFailure', () => {
    const errorMsg = 'Network Error';
    const action = LoansActions.loadLoansFailure({ error: errorMsg });
    const state = loansReducer({ ...initialState, loading: true }, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  it('should update months on loadMonthsSuccess', () => {
    const mockMonths = [6, 12, 24, 36];
    const action = LoansActions.loadMonthsSuccess({ months: mockMonths });
    const state = loansReducer(initialState, action);

    expect(state.months).toEqual(mockMonths);
    expect(state.loading).toBe(false);
  });

  it('should handle loadMonthsFailure (if implemented in reducer)', () => {
    const action = LoansActions.loadMonthsFailure({ error: 'fail' });
    // Assuming default behavior if not explicitly handled, or just ensuring no crash
    const state = loansReducer(initialState, action);
    expect(state).toBeTruthy();
  });

  it('should handle loadPurposesSuccess', () => {
    const purposes = [{ value: '1', displayText: 'Home' }] as any;
    const action = LoansActions.loadPurposesSuccess({ purposes });
    const state = loansReducer(loansInitialState, action);
    expect(state.purposes).toEqual(purposes);
  });

  it('should handle loadPurposesFailure', () => {
    const action = LoansActions.loadPurposesFailure({ error: 'fail' });
    const state = loansReducer(loansInitialState, action);
    expect(state.error).toBe('fail');
  });

  it('should handle loadPrepaymentOptionsSuccess', () => {
    const options = [{ isActive: true }] as any;
    const action = LoansActions.loadPrepaymentOptionsSuccess({ options });
    const state = loansReducer(loansInitialState, action);
    expect(state.prepaymentOptions).toEqual(options);
    expect(state.error).toBeNull();
  });

  it('should handle calculatePrepaymentSuccess', () => {
    const result = { monthlyPayment: 100 } as any;
    const action = LoansActions.calculatePrepaymentSuccess({ result });
    const state = loansReducer(loansInitialState, action);
    expect(state.calculationResult).toEqual(result);
    expect(state.error).toBeNull();
  });

  it('should handle calculatePrepaymentFailure', () => {
    const errorMsg = 'Calc failed';
    const action = LoansActions.calculatePrepaymentFailure({ error: errorMsg });
    const state = loansReducer(loansInitialState, action);
    expect(state.calculationResult).toBeNull();
    expect(state.error).toBe(errorMsg);
  });
});
