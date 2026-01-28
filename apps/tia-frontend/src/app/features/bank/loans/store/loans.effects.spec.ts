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

  const mockLoan: ILoan = { id: '1', loanAmount: 1000 } as ILoan;

  beforeEach(() => {
    loansServiceMock = {
      getAllLoans: vi.fn(),
      updateFriendlyName: vi.fn(),
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

  it('should return loadLoansSuccess on success', () => {
    const action = LoansActions.loadLoans();
    const outcome = LoansActions.loadLoansSuccess({ loans: [mockLoan] });

    actions$ = of(action);
    loansServiceMock.getAllLoans.mockReturnValue(of([mockLoan]));

    effects.loadLoans$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });

  it('should return loadLoansFailure on error', () => {
    const action = LoansActions.loadLoans();
    const errorMsg = 'Error loading';
    const outcome = LoansActions.loadLoansFailure({ error: errorMsg });

    actions$ = of(action);
    loansServiceMock.getAllLoans.mockReturnValue(
      throwError(() => new Error(errorMsg)),
    );

    effects.loadLoans$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });

  it('should return renameLoanSuccess on success', () => {
    const payload = { id: '1', name: 'New Name' };
    const action = LoansActions.renameLoan(payload);
    const outcome = LoansActions.renameLoanSuccess(payload);

    actions$ = of(action);
    loansServiceMock.updateFriendlyName.mockReturnValue(of({}));

    effects.renameLoan$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });

  it('should return renameLoanFailure on error', () => {
    const payload = { id: '1', name: 'New Name' };
    const action = LoansActions.renameLoan(payload);
    const errorMsg = 'Rename failed';
    const outcome = LoansActions.renameLoanFailure({ error: errorMsg });

    actions$ = of(action);
    loansServiceMock.updateFriendlyName.mockReturnValue(
      throwError(() => new Error(errorMsg)),
    );

    effects.renameLoan$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });
});
