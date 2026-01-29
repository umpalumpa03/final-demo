import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { LoanCreateEffects } from './loans.effects';
import { LoanCreateService } from '@tia/shared/services/loans/loan-create.service';
import { LoansCreateActions } from './loans.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Action } from '@ngrx/store';

describe('LoanCreateEffects', () => {
  let actions$: Observable<Action>;
  let effects: LoanCreateEffects;
  let service: LoanCreateService;

  const mockService = {
    requestLoan: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanCreateEffects,
        provideMockActions(() => actions$),
        { provide: LoanCreateService, useValue: mockService },
      ],
    });

    effects = TestBed.inject(LoanCreateEffects);
    service = TestBed.inject(LoanCreateService);
  });

  describe('requestLoan$', () => {
    it('should dispatch requestLoanSuccess on success', () => {
      const request = { loanAmount: 5000 } as any;
      const response = { id: '123', loanAmount: 5000 } as any;

      actions$ = of(LoansCreateActions.requestLoan({ request }));
      mockService.requestLoan.mockReturnValue(of(response));

      effects.requestLoan$.subscribe((action) => {
        expect(action).toEqual(
          LoansCreateActions.requestLoanSuccess({ loan: response }),
        );
      });
    });

    it('should dispatch requestLoanFailure on error', () => {
      const request = { loanAmount: 5000 } as any;
      const error = { message: 'Network Error' };

      actions$ = of(LoansCreateActions.requestLoan({ request }));
      mockService.requestLoan.mockReturnValue(throwError(() => error));

      effects.requestLoan$.subscribe((action) => {
        expect(action).toEqual(
          LoansCreateActions.requestLoanFailure({ error: 'Network Error' }),
        );
      });
    });

    it('should use default error message if error has no message', () => {
      const request = { loanAmount: 5000 } as any;
      const error = {};

      actions$ = of(LoansCreateActions.requestLoan({ request }));
      mockService.requestLoan.mockReturnValue(throwError(() => error));

      effects.requestLoan$.subscribe((action) => {
        expect(action).toEqual(
          LoansCreateActions.requestLoanFailure({
            error: 'Error requesting loan',
          }),
        );
      });
    });
  });

  describe('requestLoanSuccess$', () => {
    it('should not dispatch (dispatch: false)', () => {
      const action = LoansCreateActions.requestLoanSuccess({ loan: {} as any });
      actions$ = of(action);

      const consoleSpy = vi.spyOn(console, 'log');

      effects.requestLoanSuccess$.subscribe();

      expect(consoleSpy).toHaveBeenCalledWith('Loan created successfully!');
    });
  });
});
