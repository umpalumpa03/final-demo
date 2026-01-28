import { loansReducer } from './loans.reducer';
import { LoansCreateActions } from './loans.actions';
import { initialState, LoansState } from './loans.state';
import { ILoan } from '../../features/bank/loans/shared/models/loan.model';

describe('Global Loans Reducer (LoanCreate)', () => {
  it('should return the default state on unknown action', () => {
    const action = { type: 'Unknown' };
    const state = loansReducer(initialState, action as any);
    expect(state).toBe(initialState);
  });

  it('should set loading to true on requestLoan', () => {
    const action = LoansCreateActions.requestLoan({ request: {} as any });
    const state = loansReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should reset loading and clear loans array on requestLoanSuccess', () => {
    const mockLoan = { id: '123' } as ILoan;
    const action = LoansCreateActions.requestLoanSuccess({ loan: mockLoan });

    const previousState: LoansState = { ...initialState, loading: true };
    const state = loansReducer(previousState, action);

    expect(state.loading).toBe(false);
    expect(state.loans).toEqual([]);
  });

  it('should set error and stop loading on requestLoanFailure', () => {
    const error = 'API Failure';
    const action = LoansCreateActions.requestLoanFailure({ error });

    const previousState: LoansState = { ...initialState, loading: true };
    const state = loansReducer(previousState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });
});
