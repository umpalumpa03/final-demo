import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { LoansEffects } from './loans.effects';
import { LoansService } from '../shared/services/loans.service';
import { LoansActions } from './loans.actions';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
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
      calculateFullPrepayment: vi.fn(),
      calculatePartialPrepayment: vi.fn(),
      initiatePrepayment: vi.fn(),
      verifyPrepayment: vi.fn(),
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

  it('should return loadMonthsFailure on error', () => {
    const action = LoansActions.loadMonths();
    const errorMsg = 'Months fail';
    const outcome = LoansActions.loadMonthsFailure({ error: errorMsg });

    actions$ = of(action);
    loansServiceMock.getLoanMonths.mockReturnValue(
      throwError(() => new Error(errorMsg)),
    );

    effects.loadMonths$.subscribe((res) => {
      expect(res).toEqual(outcome);
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

  it('should return loadPurposesFailure on error', () => {
    const action = LoansActions.loadPurposes();
    const errorMsg = 'Purposes fail';
    const outcome = LoansActions.loadPurposesFailure({ error: errorMsg });

    actions$ = of(action);
    loansServiceMock.getPurposes.mockReturnValue(
      throwError(() => new Error(errorMsg)),
    );

    effects.loadPurposes$.subscribe((result) => {
      expect(result).toEqual(outcome);
    });
  });

  it('should trigger loadLoans when requestLoanSuccess occurs', () => {
    const action = LoansCreateActions.requestLoanSuccess({ loan: mockLoan });
    const outcome = LoansActions.loadLoans();

    actions$ = of(action);

    effects.refreshListOnCreate$.subscribe((result) => {
      expect(result).toEqual(outcome);
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

  it('should return calculatePrepaymentSuccess for PARTIAL prepayment', () => {
    const payload = {
      type: 'partial',
      loanId: '1',
      amount: 100,
      loanPartialPaymentType: 'reduce_term',
    } as any;
    const mockResult = { monthlyPayment: 50 } as any;
    const action = LoansActions.calculatePrepayment({ payload });
    const outcome = LoansActions.calculatePrepaymentSuccess({
      result: mockResult,
    });

    actions$ = of(action);
    loansServiceMock.calculatePartialPrepayment.mockReturnValue(of(mockResult));

    effects.calculatePrepayment$.subscribe((res) => {
      expect(res).toEqual(outcome);
      expect(loansServiceMock.calculatePartialPrepayment).toHaveBeenCalledWith(
        '1',
        100,
        'reduce_term',
      );
    });
  });

  it('should return initiatePrepaymentSuccess with challengeId', () => {
    const payload = { loanId: '1' } as any;
    const action = LoansActions.initiatePrepayment({ payload });
    const outcome = LoansActions.initiatePrepaymentSuccess({
      challengeId: '123',
    });

    actions$ = of(action);
    loansServiceMock.initiatePrepayment.mockReturnValue(
      of({ verify: { challengeId: '123' } }),
    );

    effects.initiatePrepayment$.subscribe((res) => {
      expect(res).toEqual(outcome);
    });
  });

  it('should return initiatePrepaymentFailure if challengeId missing', () => {
    const payload = { loanId: '1' } as any;
    const action = LoansActions.initiatePrepayment({ payload });
    const outcome = LoansActions.initiatePrepaymentFailure({
      error: 'No challenge ID returned',
    });

    actions$ = of(action);
    loansServiceMock.initiatePrepayment.mockReturnValue(of({}));

    effects.initiatePrepayment$.subscribe((res) => {
      expect(res).toEqual(outcome);
    });
  });

  it('should return verifyPrepaymentSuccess and loadLoans on success', () => {
    const payload = { challengeId: '123', code: '0000' };
    const action = LoansActions.verifyPrepayment({ payload });

    actions$ = of(action);
    loansServiceMock.verifyPrepayment.mockReturnValue(of({}));

    let count = 0;
    effects.verifyPrepayment$.subscribe((res) => {
      count++;
      if (count === 1)
        expect(res).toEqual(LoansActions.verifyPrepaymentSuccess());
      if (count === 2) expect(res).toEqual(LoansActions.loadLoans());
    });
  });
});
