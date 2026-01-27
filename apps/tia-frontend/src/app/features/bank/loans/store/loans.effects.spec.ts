import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { LoansEffects } from './loans.effects';
import { LoansService } from '../shared/services/loans.service';
import { LoansActions } from './loans.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ILoan } from '../shared/models/loan.model';

describe('LoansEffects', () => {
  let actions$: Observable<Action>;
  let effects: LoansEffects;
  let loansServiceMock: any;

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

  beforeEach(() => {
    loansServiceMock = {
      getAllLoans: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LoansEffects,
        provideMockActions(() => actions$),
        { provide: LoansService, useValue: loansServiceMock },
      ],
    });

    effects = TestBed.inject(LoansEffects);
  });

  it('should dispatch loadLoansSuccess when API call is successful', () => {
    const mockLoans: ILoan[] = [mockLoan];
    const action = LoansActions.loadLoans();
    const outcome = LoansActions.loadLoansSuccess({ loans: mockLoans });

    actions$ = of(action);
    loansServiceMock.getAllLoans.mockReturnValue(of(mockLoans));

    effects.loadLoans$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });
});
