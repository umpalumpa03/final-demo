import { describe, it, expect } from 'vitest';
import * as Selectors from './loans.selectors';
import { ILoan, ILoansState } from '../shared/models/loan.model';
import { loansInitialState } from './loans.state';

describe('Loans Selectors', () => {
  const mockLoans: ILoan[] = [
    {
      id: '1',
      status: 1,
      loanAmount: 1000,
      accountId: 'acc1',
      months: 12,
      purpose: 'Test',
      statusName: 'Pending',
      monthlyPayment: 100,
      nextPaymentDate: null,
      createdAt: '2023-01-01',
      friendlyName: 'Loan 1',
    },
    {
      id: '2',
      status: 2,
      loanAmount: 2000,
      accountId: 'acc1',
      months: 24,
      purpose: 'Test',
      statusName: 'Approved',
      monthlyPayment: 200,
      nextPaymentDate: null,
      createdAt: '2023-01-02',
      friendlyName: 'Loan 2',
    },
    {
      id: '3',
      status: 3,
      loanAmount: 3000,
      accountId: 'acc1',
      months: 36,
      purpose: 'Test',
      statusName: 'Declined',
      monthlyPayment: 300,
      nextPaymentDate: null,
      createdAt: '2023-01-03',
      friendlyName: 'Loan 3',
    },
  ];

  const initialState: ILoansState = {
    ...loansInitialState,
    loans: mockLoans,
    loading: true,
  };

  const rootState = { loans_local: initialState };

  it('should select the loan state', () => {
    const result = Selectors.selectLoansState(rootState);
    expect(result).toEqual(initialState);
  });

  it('should select all loans', () => {
    const result = Selectors.selectAllLoans(rootState);
    expect(result.length).toBe(3);
    expect(result).toEqual(mockLoans);
  });

  it('should select loading status', () => {
    const result = Selectors.selectLoansLoading(rootState);
    expect(result).toBe(true);
  });

  it('should filter loans by status', () => {
    const selector = Selectors.selectFilteredLoans(1);
    const result = selector(rootState);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(1);
  });

  it('should return all loans when filter status is null', () => {
    const selector = Selectors.selectFilteredLoans(null);
    const result = selector(rootState);
    expect(result.length).toBe(3);
  });

  it('should calculate loan counts correctly', () => {
    const result = Selectors.selectLoanCounts(rootState);

    expect(result).toEqual({
      all: 3,
      approved: 1,
      pending: 1,
      declined: 1,
    });
  });

  it('should return empty purpose options when purposes are empty', () => {
    const result = Selectors.selectPurposeOptions(rootState);
    expect(result).toEqual([]);
  });
});
