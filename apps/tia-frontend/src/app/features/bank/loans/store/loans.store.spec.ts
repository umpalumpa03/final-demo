import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { of, throwError, Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoansStore } from './loans.store';
import { LoansService } from '../shared/services/loans.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { SuccessKeys, ErrorKeys } from './loans.state';

describe('LoansStore', () => {
  let store: InstanceType<typeof LoansStore>;
  let loansService: any;
  let globalStore: any;
  let actions$: Subject<any>;
  let translate: TranslateService;

  const alertServiceMock = {
    showAlert: vi.fn(),
  };

  const mockLoans = [
    {
      id: '1',
      accountId: 'acc1',
      friendlyName: 'my loan',
      purpose: 'car',
      loanAmount: 5000,
      status: 1,
    },
    {
      id: '2',
      accountId: 'acc2',
      friendlyName: 'car loan',
      purpose: 'vehicle',
      loanAmount: 10000,
      status: 2,
    },
    {
      id: '3',
      accountId: 'acc1',
      friendlyName: 'home loan',
      purpose: 'house',
      loanAmount: 200000,
      status: 3,
    },
  ];

  const mockAccounts = [
    { id: 'acc1', name: 'Checking', friendlyName: 'My Checking' },
    { id: 'acc2', name: 'Savings', friendlyName: null },
  ];

  const mockLoanDetails = {
    id: '1',
    accountId: 'acc1',
    friendlyName: 'My Loan',
    status: 1,
    loanAmount: 5000,
  };

  beforeEach(() => {
    actions$ = new Subject();

    loansService = {
      getAllLoans: vi.fn().mockReturnValue(of([])),
      getLoanById: vi.fn(),
      updateFriendlyName: vi.fn(),
      getLoanMonths: vi.fn(),
      getPurposes: vi.fn(),
      getPrepaymentOptions: vi.fn(),
      calculateFullPrepayment: vi.fn(),
      calculatePartialPrepayment: vi.fn(),
      initiatePrepayment: vi.fn(),
      verifyPrepayment: vi.fn(),
      requestLoan: vi.fn(),
    };

    globalStore = {
      selectSignal: vi.fn(() => () => mockAccounts),
      dispatch: vi.fn(),
      pipe: vi.fn(() => of('val')),
    } as any;

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        LoansStore,
        { provide: LoansService, useValue: loansService },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: Store, useValue: globalStore },
        { provide: Actions, useValue: actions$ },
      ],
    });

    store = TestBed.inject(LoansStore);
    translate = TestBed.inject(TranslateService);

    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    expect(store.loans()).toEqual([]);
    expect(store.loading()).toBe(false);
  });

  describe('Filters and Search', () => {
    beforeEach(async () => {
      loansService.getAllLoans.mockReturnValue(of(mockLoans));
      store.loadLoans({ forceChange: true });
      await vi.waitFor(() => expect(store.loans().length).toBe(3));
    });

    it('should filter loans by status', () => {
      store.setFilter(1);
      expect(store.filteredLoans().length).toBe(1);
      expect(store.filteredLoans()[0].status).toBe(1);
    });

    it('should filter loans by account', () => {
      store.setAccountFilter('acc1');
      expect(store.filteredLoans().length).toBe(2);
    });

    it('should search loans by query', () => {
      store.setSearchQuery('car');
      expect(store.filteredLoans().length).toBeGreaterThanOrEqual(1);
    });

    it('should count loans correctly', () => {
      const counts = store.loanCounts();
      expect(counts.all).toBe(3);
      expect(counts.pending).toBe(1);
      expect(counts.approved).toBe(1);
      expect(counts.declined).toBe(1);
    });
  });

  describe('Computed Signals', () => {
    it('should map loans with account names', async () => {
      loansService.getAllLoans.mockReturnValue(of(mockLoans));
      store.loadLoans({ forceChange: true });

      await vi.waitFor(() => {
        const loansWithInfo = store.loansWithAccountInfo();
        expect(loansWithInfo[0].accountName).toBe('My Checking');
      });
    });

    it('should return active account name', () => {
      store.setAccountFilter('acc1');
      expect(store.activeAccountName()).toBe('My Checking');
    });

    it('should compute loan months options', async () => {
      loansService.getLoanMonths.mockReturnValue(of([12, 24]));
      store.loadMonths({ forceRefresh: true });

      await vi.waitFor(() => {
        expect(store.loanMonthsOptions()).toEqual([
          { label: '12 Months', value: 12 },
          { label: '24 Months', value: 24 },
        ]);
      });
    });

    it('should compute prepayment options filtering active only', async () => {
      const options = [
        {
          prepaymentDisplayName: 'Full',
          prepaymentValue: 'full',
          isActive: true,
        },
        {
          prepaymentDisplayName: 'Old',
          prepaymentValue: 'old',
          isActive: false,
        },
      ];
      loansService.getPrepaymentOptions.mockReturnValue(of(options));
      store.loadPrepaymentOptions({ forceRefresh: true });

      await vi.waitFor(() => {
        expect(store.prepaymentTypeOptions().length).toBe(1);
      });
    });
  });

  describe('Load Operations', () => {
    it('should load loans successfully', async () => {
      loansService.getAllLoans.mockReturnValue(of(mockLoans));
      store.loadLoans({ forceChange: true });

      await vi.waitFor(() => {
        expect(store.loans().length).toBe(3);
        expect(store.loading()).toBe(false);
      });
    });

    it('should load and cache loan details', async () => {
      loansService.getLoanById.mockReturnValue(of(mockLoanDetails));
      store.loadLoanDetails('1');

      await vi.waitFor(() => {
        expect(store.selectedLoanDetails()).toEqual(mockLoanDetails);
      });

      vi.clearAllMocks();
      store.loadLoanDetails('1');
      expect(loansService.getLoanById).not.toHaveBeenCalled();
    });
  });

  describe('Loan Actions', () => {
    it('should rename loan successfully', async () => {
      loansService.getAllLoans.mockReturnValue(of(mockLoans));
      loansService.updateFriendlyName.mockReturnValue(of({}));

      store.loadLoans({ forceChange: true });
      await vi.waitFor(() => expect(store.loans().length).toBe(3));

      store.renameLoan({ id: '1', name: 'New Name' });

      await vi.waitFor(() => {
        const loan = store.loans().find((l) => l.id === '1');
        expect(loan?.friendlyName).toBe('New Name');
      });
    });

    it('should rename loan and show error alert via service on failure', async () => {
      loansService.updateFriendlyName.mockReturnValue(throwError(() => ({})));

      store.renameLoan({ id: '1', name: 'New Name' });

      await vi.waitFor(() => {
        expect(store.error()).toBeNull();

        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'error',
          ErrorKeys.RENAME,
        );
      });
    });
  });

  describe('Prepayment Flow', () => {
    it('should calculate full prepayment', async () => {
      const result = { displayedInfo: [{ label: 'Total', value: '1000' }] };
      loansService.calculateFullPrepayment.mockReturnValue(
        of({ items: result.displayedInfo }),
      );

      store.calculatePrepayment({ payload: { type: 'full', loanId: '1' } });

      await vi.waitFor(() => {
        expect(store.calculationResult()).toEqual(result);
      });
    });

    it('should calculate partial prepayment', async () => {
      const result = { displayedInfo: [{ label: 'Amount', value: '500' }] };
      loansService.calculatePartialPrepayment.mockReturnValue(of(result));

      store.calculatePrepayment({
        payload: {
          type: 'partial',
          loanId: '1',
          amount: 500,
          loanPartialPaymentType: 'reduce-term',
        },
      });

      await vi.waitFor(() => {
        expect(store.calculationResult()).toEqual(result);
      });
    });

    it('should handle calculation error', async () => {
      loansService.calculateFullPrepayment.mockReturnValue(
        throwError(() => ({})),
      );
      store.calculatePrepayment({ payload: { type: 'full', loanId: '1' } });

      await vi.waitFor(() => {
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'error',
          ErrorKeys.CALCULATION,
        );
      });
    });

    it('should initiate prepayment and set challenge ID', async () => {
      loansService.initiatePrepayment.mockReturnValue(
        of({ verify: { challengeId: 'c123' } }),
      );
      store.initiatePrepayment({ payload: {} as any });

      await vi.waitFor(() => {
        expect(store.activeChallengeId()).toBe('c123');
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'success',
          SuccessKeys.OTP_SENT,
        );
      });
    });

    it('should verify prepayment successfully', async () => {
      loansService.verifyPrepayment.mockReturnValue(of({ success: true }));
      loansService.getAllLoans.mockReturnValue(of(mockLoans));

      store.verifyPrepayment({ payload: { challengeId: '1', code: '123' } });

      await vi.waitFor(() => {
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'success',
          SuccessKeys.PAYMENT_COMPLETE,
        );
        expect(store.activeChallengeId()).toBeNull();
      });
    });

    it('should handle generic verify prepayment failure', async () => {
      loansService.verifyPrepayment.mockReturnValue(throwError(() => ({})));

      store.verifyPrepayment({ payload: { challengeId: '1', code: 'wrong' } });

      await vi.waitFor(() => {
        expect(store.error()).toBeNull();
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'error',
          ErrorKeys.VERIFY_PREPAYMENT,
        );
      });
    });
  });

  describe('Request Loan', () => {
    it('should call AlertService with success message on successful Request Loan', async () => {
      loansService.requestLoan.mockReturnValue(of({ id: '1' }));
      loansService.getAllLoans.mockReturnValue(of(mockLoans));

      store.requestLoan({} as any);

      await vi.waitFor(() => {
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'success',
          SuccessKeys.REQUEST,
        );
        expect(loansService.getAllLoans).toHaveBeenCalled();
      });
    });

    it('should handle request loan error', async () => {
      loansService.requestLoan.mockReturnValue(throwError(() => ({})));

      store.requestLoan({} as any);

      await vi.waitFor(() => {
        expect(store.error()).toBeNull();
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'error',
          ErrorKeys.REQUEST_LOAN,
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle load errors', async () => {
      loansService.getAllLoans.mockReturnValue(throwError(() => ({})));
      store.loadLoans({ forceChange: true });

      await vi.waitFor(() => {
        expect(store.error()).toBe(ErrorKeys.LOAD_LOANS);
        expect(alertServiceMock.showAlert).not.toHaveBeenCalled();
      });
    });
    it('should handle detail load errors', async () => {
      loansService.getLoanById.mockReturnValue(throwError(() => ({})));
      store.loadLoanDetails('999');

      await vi.waitFor(() => {
        expect(store.error()).toBeNull();
        expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
          'error',
          ErrorKeys.LOAD_DETAILS,
        );
      });
    });
  });
});
