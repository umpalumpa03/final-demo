import { TestBed } from '@angular/core/testing';
import { LoansStore } from './loans.store';
import { LoansService } from '../shared/services/loans.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
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
  let loansServiceMock: any;
  let actions$: Subject<Action>;

  const mockLoan = {
    id: '1',
    accountId: 'acc1',
    status: 1,
    purpose: 'personal',
    friendlyName: 'My Loan',
    loanAmount: 1000,
    accountName: '',
  };

  const mockLoan2 = {
    id: '2',
    accountId: 'acc2',
    status: 2,
    purpose: 'business',
    friendlyName: 'Business Loan',
    loanAmount: 5000,
    accountName: '',
  };

  const mockLoan3 = {
    id: '3',
    accountId: 'acc3',
    status: 3,
    purpose: 'education',
    friendlyName: 'Education Loan',
    loanAmount: 3000,
    accountName: '',
  };

  beforeEach(() => {
    loansServiceMock = {
      getAllLoans: vi.fn().mockReturnValue(of([mockLoan])),
      getLoanById: vi.fn().mockReturnValue(of(mockLoan)),
      updateFriendlyName: vi.fn().mockReturnValue(of(mockLoan)),
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

    TestBed.configureTestingModule({
      providers: [
        LoansStore,
        { provide: LoansService, useValue: loansServiceMock },
        provideMockStore({
          selectors: [
            {
              selector: selectAccounts,
              value: [
                { id: 'acc1', friendlyName: 'Acc1' },
                { id: 'acc2', name: 'Account 2' },
              ],
            },
          ],
        }),
        provideMockActions(() => actions$),
      ],
    });

    store = TestBed.inject(LoansStore);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Computed Signals', () => {
    it('should return all loans when filter status is null', () => {
      store.loadLoans();
      TestBed.tick();
      store.setFilter(null);
      expect(store.filteredLoans().length).toBe(1);
    });

    it('should filter loans by status', () => {
      loansServiceMock.getAllLoans.mockReturnValue(
        of([mockLoan, mockLoan2, mockLoan3]),
      );
      store.loadLoans();
      TestBed.tick();

      store.setFilter(2);
      expect(store.filteredLoans().length).toBe(1);
      expect(store.filteredLoans()[0].status).toBe(2);
    });

    it('should return null alert if no message present', () => {
      store.hideAlert();
      expect(store.alert()).toBeNull();
    });

    it('should return null alert if no type present', () => {
      store.showAlert('msg', null as any);
      expect(store.alert()).toBeNull();
    });

    it('should return alert when both message and type are present', () => {
      store.showAlert('Test message', 'success');
      const alert = store.alert();
      expect(alert).not.toBeNull();
      expect(alert?.message).toBe('Test message');
      expect(alert?.type).toBe('success');
    });

    it('should handle missing accounts in loansWithAccountInfo', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          LoansStore,
          { provide: LoansService, useValue: loansServiceMock },
          provideMockStore({
            selectors: [{ selector: selectAccounts, value: null }],
          }),
          provideMockActions(() => actions$),
        ],
      });
      store = TestBed.inject(LoansStore);

      store.loadLoans();
      TestBed.tick();

      expect(store.loansWithAccountInfo()[0].accountName).toBe(
        'Loading Account...',
      );
    });

    it('should use friendlyName over name when available', () => {
      store.loadLoans();
      TestBed.tick();

      const loanWithAccount = store.loansWithAccountInfo()[0];
      expect(loanWithAccount.accountName).toBe('Acc1');
    });

    it('should return loanCounts from dashboardCounts', () => {
      loansServiceMock.getAllLoans.mockReturnValue(
        of([mockLoan, mockLoan2, mockLoan3]),
      );
      store.loadCounts();
      TestBed.tick();

      const counts = store.loanCounts();
      expect(counts.all).toBe(3);
      expect(counts.pending).toBe(1);
      expect(counts.approved).toBe(1);
    });

    it('should map loan months to options', () => {
      store.loadMonths();
      TestBed.tick();

      const options = store.loanMonthsOptions();
      expect(options).toEqual([
        { label: '12 Months', value: 12 },
        { label: '24 Months', value: 24 },
      ]);
    });

    it('should filter active prepayment options', () => {
      store.loadPrepaymentOptions();
      TestBed.tick();

      const options = store.prepaymentTypeOptions();
      expect(options.length).toBe(1);
      expect(options[0].value).toBe('opt1');
    });
  });

  describe('Loading Methods', () => {
    it('should load loans with status parameter', () => {
      store.loadLoans(1);
      TestBed.tick();

      expect(loansServiceMock.getAllLoans).toHaveBeenCalledWith(1);
    });

    it('should handle loadMonths error', () => {
      loansServiceMock.getLoanMonths.mockReturnValue(
        throwError(() => new Error('Month Error')),
      );
      store.loadMonths();
      TestBed.tick();
      expect(store.error()).toBe('Month Error');
    });

    it('should handle loadPurposes error', () => {
      loansServiceMock.getPurposes.mockReturnValue(
        throwError(() => new Error('Purpose Error')),
      );
      store.loadPurposes();
      TestBed.tick();
      expect(store.error()).toBe('Purpose Error');
    });

    it('should handle loadPrepaymentOptions error', () => {
      loansServiceMock.getPrepaymentOptions.mockReturnValue(
        throwError(() => new Error('Option Error')),
      );
      store.loadPrepaymentOptions();
      TestBed.tick();
      expect(store.error()).toBe('Option Error');
    });

    it('should handle loadCounts error', () => {
      loansServiceMock.getAllLoans.mockReturnValue(
        throwError(() => new Error('Count Error')),
      );
      store.loadCounts();
      TestBed.tick();
      expect(store.dashboardCounts().all).toBe(0);
    });

    it('should handle loadLoanDetails error', () => {
      loansServiceMock.getLoanById.mockReturnValue(
        throwError(() => new Error('Detail Error')),
      );
      store.loadLoanDetails('1');
      TestBed.tick();
      expect(store.error()).toBe('Detail Error');
      expect(store.detailsLoading()).toBe(false);
    });

    it('should clear loan details manually', () => {
      store.loadLoanDetails('1');
      TestBed.tick();

      store.clearLoanDetails();
      expect(store.selectedLoanDetails()).toBeNull();
      expect(store.detailsLoading()).toBe(false);
    });
  });

  describe('Action Methods', () => {
    it('should handle renameLoan error', () => {
      loansServiceMock.updateFriendlyName.mockReturnValue(
        throwError(() => new Error('Rename Error')),
      );
      store.renameLoan({ id: '1', name: 'New' });
      TestBed.tick();
      expect(store.error()).toBe('Rename Error');
    });

    it('should rename loan successfully', () => {
      loansServiceMock.getAllLoans.mockReturnValue(of([mockLoan, mockLoan2]));
      store.loadLoans();
      TestBed.tick();

      store.renameLoan({ id: '1', name: 'Updated Name' });
      TestBed.tick();

      const loans = store.loans();
      const updatedLoan = loans.find((l) => l.id === '1');
      expect(updatedLoan?.friendlyName).toBe('Updated Name');
    });

    it('should calculate full prepayment successfully', () => {
      const mockResult = { items: [{ text: 'Test' }] };
      loansServiceMock.calculateFullPrepayment.mockReturnValue(of(mockResult));

      store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
      TestBed.tick();

      expect(store.calculationResult()).toEqual({
        displayedInfo: mockResult.items,
      });
      expect(store.actionLoading()).toBe(false);
    });

    it('should clear calculation result', () => {
      store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
      TestBed.tick();

      store.clearCalculationResult();
      expect(store.calculationResult()).toBeNull();
      expect(store.activeChallengeId()).toBeNull();
    });

    it('should handle verifyPrepayment error', () => {
      loansServiceMock.verifyPrepayment.mockReturnValue(
        throwError(() => new Error('Verify Error')),
      );
      store.verifyPrepayment({ payload: { challengeId: 'c', code: '1' } });
      TestBed.tick();
      expect(store.error()).toBe('Verify Error');
      expect(store.actionLoading()).toBe(false);
    });
  });

  describe('Initiate Prepayment', () => {
    const validPayload: IInitiatePrepaymentRequest = {
      loanId: '1',
      loanPrepaymentOption: 'full',
      paymentAccountId: 'acc1',
    };

    it('should initiate prepayment successfully', () => {
      store.initiatePrepayment({ payload: validPayload });
      TestBed.tick();

      expect(store.activeChallengeId()).toBe('chal-123');
      expect(store.alertMessage()).toBe(
        'OTP sent to your registered mobile number',
      );
      expect(store.alertType()).toBe('success');
      expect(store.actionLoading()).toBe(false);
    });

    it('should auto-hide success alert after 3 seconds', () => {
      store.initiatePrepayment({ payload: validPayload });
      TestBed.tick();

      expect(store.alertMessage()).toBe(
        'OTP sent to your registered mobile number',
      );

      vi.advanceTimersByTime(3000);
      expect(store.alertMessage()).toBeNull();
      expect(store.alertType()).toBeNull();
    });

    it('should handle insufficient funds error (400)', () => {
      const errorResponse = new HttpErrorResponse({
        status: 400,
        error: { message: 'Insufficient funds in payment account' },
      });
      loansServiceMock.initiatePrepayment.mockReturnValue(
        throwError(() => errorResponse),
      );

      store.initiatePrepayment({ payload: validPayload });
      TestBed.tick();

      expect(store.alertMessage()).toBe(
        'Insufficient funds in payment account',
      );
      expect(store.alertType()).toBe('error');

      vi.advanceTimersByTime(3000);
      expect(store.alertMessage()).toBeNull();
    });

    it('should handle generic 500 error', () => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
        error: { message: 'Http failure' },
      });
      loansServiceMock.initiatePrepayment.mockReturnValue(
        throwError(() => errorResponse),
      );

      store.initiatePrepayment({ payload: validPayload });
      TestBed.tick();

      expect(store.alertMessage()).toBe('Http failure');
      expect(store.alertType()).toBe('error');
    });

    it('should handle 400 error with different message', () => {
      const errorResponse = new HttpErrorResponse({
        status: 400,
        error: { message: 'Invalid payment account' },
      });
      loansServiceMock.initiatePrepayment.mockReturnValue(
        throwError(() => errorResponse),
      );

      store.initiatePrepayment({ payload: validPayload });
      TestBed.tick();

      expect(store.alertMessage()).toBe('Invalid payment account');
      expect(store.alertType()).toBe('error');
    });
  });
});
