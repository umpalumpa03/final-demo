import { LoansCreateActions } from './loans.actions';
import { describe, it, expect } from 'vitest';
import { ILoanRequest } from '../../features/bank/loans/shared/models/loan-request.model';
import { ILoan } from '../../features/bank/loans/shared/models/loan.model';

describe('LoansCreateActions', () => {
  it('should create Request Loan action', () => {
    const payload = { loanAmount: 100 } as ILoanRequest;
    const action = LoansCreateActions.requestLoan({ request: payload });

    expect(action.type).toBe('[Loans Global API] Request Loan');
    expect(action.request).toEqual(payload);
  });

  it('should create Request Loan Success action', () => {
    const payload = { id: '1' } as ILoan;
    const action = LoansCreateActions.requestLoanSuccess({ loan: payload });

    expect(action.type).toBe('[Loans Global API] Request Loan Success');
    expect(action.loan).toEqual(payload);
  });

  it('should create Request Loan Failure action', () => {
    const error = 'Something went wrong';
    const action = LoansCreateActions.requestLoanFailure({ error });

    expect(action.type).toBe('[Loans Global API] Request Loan Failure');
    expect(action.error).toBe(error);
  });
});
