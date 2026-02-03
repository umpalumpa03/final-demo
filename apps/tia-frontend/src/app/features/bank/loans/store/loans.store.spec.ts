import { TestBed } from '@angular/core/testing';
import { LoansStore } from './loans.store';
import { LoansService } from '../shared/services/loans.service';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { IInitiatePrepaymentRequest } from '../shared/models/prepayment.model';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';

describe('LoansStore', () => {
  let store: InstanceType<typeof LoansStore>;
  let svc: any;
  let actions$: Subject<Action>;

  const loan1 = {
    id: '1',
    accountId: 'acc1',
    status: 1,
    purpose: 'personal',
    friendlyName: 'My Loan',
    loanAmount: 1000,
    accountName: '',
  };
  const loan2 = {
    id: '2',
    accountId: 'acc2',
    status: 2,
    purpose: 'business',
    friendlyName: 'Business Loan',
    loanAmount: 5000,
    accountName: '',
  };
  const loan3 = {
    id: '3',
    accountId: 'acc3',
    status: 3,
    purpose: 'education',
    friendlyName: 'Education Loan',
    loanAmount: 3000,
    accountName: '',
  };

  const validPayload: IInitiatePrepaymentRequest = {
    loanId: '1',
    loanPrepaymentOption: 'full',
    paymentAccountId: 'acc1',
  };

  function setupTestBed(
    accountsValue: any = [
      { id: 'acc1', friendlyName: 'Acc1' },
      { id: 'acc2', name: 'Account 2' },
    ],
  ) {
    TestBed.configureTestingModule({
      providers: [
        LoansStore,
        { provide: LoansService, useValue: svc },
        provideMockStore({
          selectors: [{ selector: selectAccounts, value: accountsValue }],
        }),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(LoansStore);
  }

  beforeEach(() => {
    svc = {
      getAllLoans: vi.fn().mockReturnValue(of([loan1])),
      getLoanById: vi.fn().mockReturnValue(of(loan1)),
      updateFriendlyName: vi.fn().mockReturnValue(of(loan1)),
      getLoanMonths: vi.fn().mockReturnValue(of([12, 24])),
      getPurposes: vi
        .fn()
        .mockReturnValue(of([{ value: 'p1', displayText: 'Purpose 1' }])),
      getPrepaymentOptions: vi.fn().mockReturnValue(
        of([
          {
            prepaymentDisplayName: 'Opt1',
            prepaymentValue: 'opt1',
            isActive: true,
          },
          {
            prepaymentDisplayName: 'Opt2',
            prepaymentValue: 'opt2',
            isActive: false,
          },
        ]),
      ),
      calculateFullPrepayment: vi.fn().mockReturnValue(of({ items: [] })),
      calculatePartialPrepayment: vi
        .fn()
        .mockReturnValue(of({ displayedInfo: [] })),
      initiatePrepayment: vi
        .fn()
        .mockReturnValue(of({ verify: { challengeId: 'chal-123' } })),
      verifyPrepayment: vi.fn().mockReturnValue(of({})),
    };
    actions$ = new Subject<Action>();
    setupTestBed();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should return all loans when filter is null', () => {
    store.loadLoans();
    TestBed.tick();
    store.setFilter(null);
    expect(store.filteredLoans().length).toBe(1);
  });

  it('should filter loans by status', () => {
    svc.getAllLoans.mockReturnValue(of([loan1, loan2, loan3]));
    store.loadLoans();
    TestBed.tick();
    store.setFilter(2);
    expect(store.filteredLoans().length).toBe(1);
    expect(store.filteredLoans()[0].status).toBe(2);
  });

  it('should use friendlyName over name for matched account', () => {
    store.loadLoans();
    TestBed.tick();
    expect(store.loansWithAccountInfo()[0].accountName).toBe('Acc1');
  });

  it('should map purposes to label/value options', () => {
    store.loadPurposes();
    TestBed.tick();
    expect(store.purposeOptions()).toEqual([
      { label: 'Purpose 1', value: 'p1' },
    ]);
  });

  it('should call getAllLoans with status param', () => {
    store.loadLoans(1);
    TestBed.tick();
    expect(svc.getAllLoans).toHaveBeenCalledWith(1);
  });

  it('should load counts and compute dashboard totals', () => {
    svc.getAllLoans.mockReturnValue(of([loan1, loan2, loan3]));
    store.loadCounts();
    TestBed.tick();
    expect(store.loanCounts()).toEqual({
      all: 3,
      approved: 1,
      pending: 1,
      declined: 1,
    });
  });

  it('should load loan details by id', () => {
    store.loadLoanDetails('1');
    TestBed.tick();
    expect(store.selectedLoanDetails()).toEqual(loan1);
    expect(store.detailsLoading()).toBe(false);
  });

  it('should set error on loadMonths failure', () => {
    svc.getLoanMonths.mockReturnValue(
      throwError(() => new Error('Months fail')),
    );
    store.loadMonths();
    TestBed.tick();
    expect(store.error()).toBe('Months fail');
  });

  it('should set error on loadPurposes failure', () => {
    svc.getPurposes.mockReturnValue(
      throwError(() => new Error('Purpose fail')),
    );
    store.loadPurposes();
    TestBed.tick();
    expect(store.error()).toBe('Purpose fail');
  });

  it('should set error on loadPrepaymentOptions failure', () => {
    svc.getPrepaymentOptions.mockReturnValue(
      throwError(() => new Error('Option Error')),
    );
    store.loadPrepaymentOptions();
    TestBed.tick();
    expect(store.error()).toBe('Option Error');
  });

  it('should rename loan and update local state', () => {
    svc.getAllLoans.mockReturnValue(of([loan1, loan2]));
    store.loadLoans();
    TestBed.tick();
    store.renameLoan({ id: '1', name: 'New Name' });
    TestBed.tick();
    expect(store.loans().find((l) => l.id === '1')?.friendlyName).toBe(
      'New Name',
    );
  });

  it('should set error on renameLoan failure', () => {
    svc.getAllLoans.mockReturnValue(of([loan1]));
    store.loadLoans();
    TestBed.tick();
    svc.updateFriendlyName.mockReturnValue(
      throwError(() => new Error('Rename fail')),
    );
    store.renameLoan({ id: '1', name: 'X' });
    TestBed.tick();
    expect(store.error()).toBe('Rename fail');
  });

  it('should calculate full prepayment', () => {
    svc.calculateFullPrepayment.mockReturnValue(
      of({ items: [{ text: 'Info' }] }),
    );
    store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
    TestBed.tick();
    expect(store.calculationResult()).toEqual({
      displayedInfo: [{ text: 'Info' }],
    });
    expect(store.actionLoading()).toBe(false);
  });

  it('should calculate partial prepayment', () => {
    const partial = { displayedInfo: [{ text: 'Partial' }] };
    svc.calculatePartialPrepayment.mockReturnValue(of(partial));
    store.calculatePrepayment({
      payload: {
        loanId: '1',
        type: 'partial',
        amount: 500,
        loanPartialPaymentType: 'reduce',
      },
    });
    TestBed.tick();
    expect(svc.calculatePartialPrepayment).toHaveBeenCalledWith(
      '1',
      500,
      'reduce',
    );
    expect(store.calculationResult()).toEqual(partial);
  });

  it('should set error on calculatePrepayment failure', () => {
    svc.calculateFullPrepayment.mockReturnValue(
      throwError(() => new Error('Calc fail')),
    );
    store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
    TestBed.tick();
    expect(store.error()).toBe('Calc fail');
    expect(store.calculationResult()).toBeNull();
  });

  it('should clear calculation result and challengeId', () => {
    store.showAlert('x', 'success');
    store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
    TestBed.tick();
    store.clearCalculationResult();
    expect(store.calculationResult()).toBeNull();
    expect(store.activeChallengeId()).toBeNull();
  });

  it('should hide alert manually', () => {
    store.showAlert('test', 'error');
    expect(store.alertMessage()).toBe('test');
    store.hideAlert();
    expect(store.alertMessage()).toBeNull();
    expect(store.alertType()).toBeNull();
  });

  it('should initiate prepayment and set challengeId', () => {
    store.initiatePrepayment({ payload: validPayload });
    TestBed.tick();
    expect(store.activeChallengeId()).toBe('chal-123');
    expect(store.alertMessage()).toBe(
      'OTP sent to your registered mobile number',
    );
    expect(store.alertType()).toBe('success');
    expect(store.actionLoading()).toBe(false);
  });

  it('should auto-hide alert after 3 seconds', () => {
    store.initiatePrepayment({ payload: validPayload });
    TestBed.tick();
    expect(store.alertMessage()).not.toBeNull();
    vi.advanceTimersByTime(3000);
    expect(store.alertMessage()).toBeNull();
    expect(store.alertType()).toBeNull();
  });

  it('should set error when no challengeId returned', () => {
    svc.initiatePrepayment.mockReturnValue(of({ verify: {} }));
    store.initiatePrepayment({ payload: validPayload });
    TestBed.tick();
    expect(store.error()).toBe('No challenge ID returned');
    expect(store.actionLoading()).toBe(false);
  });

  it('should show insufficient funds error on 400', () => {
    svc.initiatePrepayment.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { message: 'Insufficient funds in payment account' },
          }),
      ),
    );
    store.initiatePrepayment({ payload: validPayload });
    TestBed.tick();
    expect(store.alertMessage()).toBe('Insufficient funds in payment account');
    expect(store.alertType()).toBe('error');
    vi.advanceTimersByTime(3000);
    expect(store.alertMessage()).toBeNull();
  });

  it('should show backend message for non-400 errors', () => {
    svc.initiatePrepayment.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            error: { message: 'Server error' },
          }),
      ),
    );
    store.initiatePrepayment({ payload: validPayload });
    TestBed.tick();
    expect(store.alertMessage()).toBe('Server error');
    expect(store.alertType()).toBe('error');
  });

  it('should verify prepayment and reload loans', () => {
    svc.getAllLoans.mockReturnValue(of([loan1]));
    store.verifyPrepayment({ payload: { challengeId: 'c', code: '123' } });
    TestBed.tick();
    expect(store.activeChallengeId()).toBeNull();
    expect(store.calculationResult()).toBeNull();
    expect(store.actionLoading()).toBe(false);
    expect(svc.getAllLoans).toHaveBeenCalled();
  });

  it('should set error on verifyPrepayment failure', () => {
    svc.verifyPrepayment.mockReturnValue(
      throwError(() => new Error('Verify Error')),
    );
    store.verifyPrepayment({ payload: { challengeId: 'c', code: '1' } });
    TestBed.tick();
    expect(store.error()).toBe('Verify Error');
    expect(store.actionLoading()).toBe(false);
  });

  it('should reload loans on LoansCreateActions.requestLoanSuccess', () => {
    svc.getAllLoans.mockReturnValue(of([loan1]));
    actions$.next(
      LoansCreateActions.requestLoanSuccess({ loan: loan1 as any }),
    );
    TestBed.tick();
    expect(svc.getAllLoans).toHaveBeenCalled();
  });
});
