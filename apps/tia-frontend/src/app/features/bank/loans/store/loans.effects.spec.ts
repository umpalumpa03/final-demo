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
      getLoanMonths: vi.fn(),
      getPurposes: vi.fn(),
      getPrepaymentOptions: vi.fn(),
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

  it('should return loadPurposesSuccess on success', () => {
    const mockPurposes = [{ displayText: 'Home', value: 'home' }] as any;
    const action = LoansActions.loadPurposes();
    const outcome = LoansActions.loadPurposesSuccess({
      purposes: mockPurposes,
    });

    actions$ = of(action);
    loansServiceMock.getPurposes.mockReturnValue(of(mockPurposes));

    effects.loadPurposes$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });

  it('should return loadMonthsSuccess on success', () => {
    const months = [1, 2];
    const action = LoansActions.loadMonths();
    const outcome = LoansActions.loadMonthsSuccess({ months });

    actions$ = of(action);
    loansServiceMock.getLoanMonths.mockReturnValue(of(months));

    effects.loadMonths$.subscribe((res) => {
      expect(res).toEqual(outcome);
    });
  });

  it('should return loadPrepaymentOptionsSuccess on success', () => {
    const options = [] as any;
    const action = LoansActions.loadPrepaymentOptions();
    const outcome = LoansActions.loadPrepaymentOptionsSuccess({ options });

    actions$ = of(action);
    loansServiceMock.getPrepaymentOptions.mockReturnValue(of(options));

    effects.loadPrepaymentOptions$.subscribe((res) => {
      expect(res).toEqual(outcome);
    });
  });

  it('should return loadPrepaymentOptionsFailure on error', () => {
    const action = LoansActions.loadPrepaymentOptions();
    const errorMsg = 'fail';
    const outcome = LoansActions.loadPrepaymentOptionsFailure({
      error: errorMsg,
    });

    actions$ = of(action);
    loansServiceMock.getPrepaymentOptions.mockReturnValue(
      throwError(() => new Error(errorMsg)),
    );

    effects.loadPrepaymentOptions$.subscribe((res) => {
      expect(res).toEqual(outcome);
    });
  });
});
