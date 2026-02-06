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

  it('should filter loans by status', () => {
    svc.getAllLoans.mockReturnValue(of([loan1, loan2, loan3]));
    store.loadLoans({ status: null });
    TestBed.tick();
    store.setFilter(2);
    expect(store.filteredLoans().length).toBe(1);
    expect(store.filteredLoans()[0].status).toBe(2);
    store.setFilter(null);
    expect(store.filteredLoans().length).toBe(3);
  });

  it('should skip loading if loans exist without forceChange', () => {
    store.loadLoans({ status: null });
    TestBed.tick();
    svc.getAllLoans.mockClear();
    store.loadLoans({ status: null, forceChange: false });
    TestBed.tick();
    expect(svc.getAllLoans).not.toHaveBeenCalled();
    store.loadLoans({ status: null, forceChange: true });
    TestBed.tick();
    expect(svc.getAllLoans).toHaveBeenCalled();
  });

  it('should map account names correctly', () => {
    svc.getAllLoans.mockReturnValue(of([loan1, loan2]));
    store.loadLoans({ status: null, forceChange: true });
    TestBed.tick();
    expect(store.loansWithAccountInfo()[0].accountName).toBe('Acc1');
    expect(store.loansWithAccountInfo()[1].accountName).toBe('Account 2');
  });

  it('should map options correctly', () => {
    store.loadMonths();
    store.loadPurposes();
    store.loadPrepaymentOptions();
    TestBed.tick();
    expect(store.loanMonthsOptions()).toEqual([
      { label: '12 Months', value: 12 },
      { label: '24 Months', value: 24 },
    ]);
    expect(store.purposeOptions()).toEqual([
      { label: 'Purpose 1', value: 'p1' },
    ]);
    expect(store.prepaymentTypeOptions()).toEqual([
      { label: 'Opt1', value: 'opt1' },
    ]);
  });

  it('should handle alert', () => {
    expect(store.alert()).toBeNull();
    store.showAlert('Test', 'success');
    expect(store.alert()).toEqual({ message: 'Test', type: 'success' });
    store.hideAlert();
    expect(store.alert()).toBeNull();
  });

  it('should load counts', () => {
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

  it('should handle loadCounts error', () => {
    svc.getAllLoans.mockReturnValue(throwError(() => new Error('Fail')));
    store.loadCounts();
    TestBed.tick();
    expect(store.loanCounts()).toEqual({
      all: 0,
      approved: 0,
      pending: 0,
      declined: 0,
    });
  });

  it('should load and clear loan details', () => {
    store.loadLoanDetails('1');
    TestBed.tick();
    expect(store.selectedLoanDetails()).toEqual(loan1);
    expect(store.detailsLoading()).toBe(false);
    store.clearLoanDetails();
    expect(store.selectedLoanDetails()).toBeNull();
  });

  it('should rename loan', () => {
    svc.getAllLoans.mockReturnValue(of([loan1, loan2]));
    store.loadLoans({ status: null });
    TestBed.tick();
    store.renameLoan({ id: '1', name: 'New Name' });
    TestBed.tick();
    expect(store.loans().find((l) => l.id === '1')?.friendlyName).toBe(
      'New Name',
    );
  });

  it('should handle renameLoan error', () => {
    svc.getAllLoans.mockReturnValue(of([loan1]));
    store.loadLoans({ status: null });
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

  it('should handle calculatePrepayment error', () => {
    svc.calculateFullPrepayment.mockReturnValue(
      throwError(() => new Error('Calc fail')),
    );
    store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
    TestBed.tick();
    expect(store.error()).toBe('Calc fail');
    expect(store.calculationResult()).toBeNull();
  });

  it('should clear calculation result', () => {
    store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
    TestBed.tick();
    store.clearCalculationResult();
    expect(store.calculationResult()).toBeNull();
    expect(store.activeChallengeId()).toBeNull();
  });

  it('should initiate prepayment', () => {
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
  });

  it('should handle initiatePrepayment with no challengeId', () => {
    svc.initiatePrepayment.mockReturnValue(of({ verify: {} }));
    store.initiatePrepayment({ payload: validPayload });
    TestBed.tick();
    expect(store.error()).toBe('No challenge ID returned');
  });

  it('should handle insufficient funds error', () => {
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
  });

  it('should handle backend error', () => {
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
  });

  it('should verify prepayment', () => {
    svc.getAllLoans.mockReturnValue(of([loan1]));
    store.verifyPrepayment({ payload: { challengeId: 'c', code: '123' } });
    TestBed.tick();
    expect(store.activeChallengeId()).toBeNull();
    expect(store.calculationResult()).toBeNull();
    expect(store.actionLoading()).toBe(false);
    expect(svc.getAllLoans).toHaveBeenCalled();
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
