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
      accountId: 'acc2',
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
    purposes: [{ displayText: 'Home', value: 'home' } as any],
    prepaymentOptions: [
      {
        isActive: true,
        prepaymentValue: 'full',
        prepaymentDisplayName: 'Full',
      } as any,
      {
        isActive: false,
        prepaymentValue: 'partial',
        prepaymentDisplayName: 'Partial',
      } as any,
    ],
    months: [12, 24],
    activeChallengeId: 'challenge-123',
    calculationResult: { monthlyPayment: 500 } as any,
  };

  const rootState = { loans_local: initialState };

  it('should select the loan state', () => {
    const result = Selectors.selectLoansState(rootState);
    expect(result).toEqual(initialState);
  });

  it('should select all loans', () => {
    const result = Selectors.selectAllLoans.projector(initialState);
    expect(result.length).toBe(3);
    expect(result).toEqual(mockLoans);
  });

  it('should select loading state', () => {
    const result = Selectors.selectLoansLoading.projector(initialState);
    expect(result).toBe(true);
  });

  it('should select active challenge id', () => {
    const result = Selectors.selectActiveChallengeId.projector(initialState);
    expect(result).toBe('challenge-123');
  });

  it('should select calculation result', () => {
    const result = Selectors.selectCalculationResult.projector(initialState);
    expect(result).toEqual({ monthlyPayment: 500 });
  });

  it('should select only active prepayment options', () => {
    const result =
      Selectors.selectPrepaymentTypeOptions.projector(initialState);
    expect(result.length).toBe(1);
    expect(result[0].value).toBe('full');
  });

  describe('selectLoansWithAccountInfo', () => {
    it('should handle account not found for a loan', () => {
      const loans = [mockLoans[0]];
      const accounts = [{ id: 'other-id', name: 'X' }] as any;
      const result = Selectors.selectLoansWithAccountInfo.projector(
        loans,
        accounts,
      );
      expect(result[0].accountName).toBe('Loading Account...');
    });
  });

  describe('selectFilteredLoans', () => {
    const joinedLoans = mockLoans.map((l) => ({
      ...l,
      accountName: 'Test Acc',
    }));

    it('should return all loans when status is null', () => {
      const result = Selectors.selectFilteredLoans(null).projector(joinedLoans);
      expect(result.length).toBe(3);
    });

    it('should filter loans by specific status', () => {
      const result = Selectors.selectFilteredLoans(1).projector(joinedLoans);
      expect(result.length).toBe(1);
      expect(result[0].status).toBe(1);
    });
  });

  describe('selectLoanCounts', () => {
    it('should calculate counts correctly', () => {
      const result = Selectors.selectLoanCounts.projector(mockLoans);
      expect(result).toEqual({
        all: 3,
        approved: 1,
        pending: 1,
        declined: 1,
      });
    });
  });

  describe('selectLoanMonthsOptions', () => {
    it('should map months to options', () => {
      const months = [12, 24];
      const result = Selectors.selectLoanMonthsOptions.projector(months);
      expect(result).toEqual([
        { label: '12 Months', value: 12 },
        { label: '24 Months', value: 24 },
      ]);
    });
  });

  describe('selectPurposeOptions', () => {
    it('should map purposes to options', () => {
      const result = Selectors.selectPurposeOptions.projector(initialState);
      expect(result).toEqual([{ label: 'Home', value: 'home' }]);
    });
  });
});
