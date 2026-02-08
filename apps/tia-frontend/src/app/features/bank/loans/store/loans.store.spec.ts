import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { of, throwError, Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoansStore } from './loans.store';
import { LoansService } from '../shared/services/loans.service';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoansStore', () => {
  let store: InstanceType<typeof LoansStore>;
  let loansService: any;
  let globalStore: any;
  let actions$: Subject<any>;

  const mockLoans = [
    {
      id: '1',
      accountId: 'acc1',
      friendlyName: 'My Loan',
      purpose: 'home improvement',
      loanAmount: 10000,
      status: 1,
    },
    {
      id: '2',
      accountId: 'acc2',
      friendlyName: 'Car Loan',
      purpose: 'vehicle',
      loanAmount: 20000,
      status: 2,
    },
    {
      id: '3',
      accountId: 'acc1',
      friendlyName: 'Personal',
      purpose: 'personal',
      loanAmount: 5000,
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
    loanAmount: 10000,
    status: 1,
  };

  beforeEach(() => {
    actions$ = new Subject();
    loansService = {
      getAllLoans: vi.fn(),
      getLoanById: vi.fn(),
      updateFriendlyName: vi.fn(),
      getLoanMonths: vi.fn(),
      getPurposes: vi.fn(),
      getPrepaymentOptions: vi.fn(),
      calculateFullPrepayment: vi.fn(),
      calculatePartialPrepayment: vi.fn(),
      initiatePrepayment: vi.fn(),
      verifyPrepayment: vi.fn(),
    };
    globalStore = {
      selectSignal: vi.fn(() => () => mockAccounts),
    };

    TestBed.configureTestingModule({
      providers: [
        LoansStore,
        { provide: LoansService, useValue: loansService },
        { provide: Store, useValue: globalStore },
        { provide: Actions, useValue: actions$ },
      ],
    });
    store = TestBed.inject(LoansStore);
  });

  it('should initialize with default state', () => {
    expect(store.loans()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.filterStatus()).toBeNull();
  });

  it('should compute loansWithAccountInfo', () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.loadLoans({});
    const loansWithInfo = store.loansWithAccountInfo();
    expect(loansWithInfo[0].accountName).toBe('My Checking');
    expect(loansWithInfo[1].accountName).toBe('Savings');
  });

  it('should show Unknown Account for unmatched', () => {
    loansService.getAllLoans.mockReturnValue(
      of([{ ...mockLoans[0], accountId: 'unknown' }]),
    );
    store.loadLoans({});
    expect(store.loansWithAccountInfo()[0].accountName).toBe('Unknown Account');
  });

  it('should filter by account and status', () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.loadLoans({});
    store.setAccountFilter('acc1');
    expect(store.filteredLoans().length).toBe(2);
    store.setFilter(1);
    expect(store.filteredLoans().length).toBe(1);
  });

  it('should compute activeAccountName', () => {
    store.setAccountFilter('acc1');
    expect(store.activeAccountName()).toBe('My Checking');
    store.setAccountFilter(null);
    expect(store.activeAccountName()).toBeNull();
  });

  it('should compute loan counts', () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.loadLoans({});
    const counts = store.loanCounts();
    expect(counts.all).toBe(3);
    expect(counts.pending).toBe(1);
  });

  it('should filter by search query', () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.loadLoans({});
    store.setSearchQuery('car');
    expect(store.filteredLoans().length).toBe(1);
    store.setSearchQuery('5000');
    expect(store.filteredLoans().length).toBe(1);
  });

  it('should compute options', () => {
    loansService.getLoanMonths.mockReturnValue(of([12, 24]));
    loansService.getPurposes.mockReturnValue(
      of([{ displayText: 'Home', value: 'home' }]),
    );
    loansService.getPrepaymentOptions.mockReturnValue(
      of([
        { prepaymentDisplayName: 'Full', prepaymentValue: 1, isActive: true },
      ]),
    );
    store.loadMonths({});
    store.loadPurposes({});
    store.loadPrepaymentOptions({});
    expect(store.loanMonthsOptions().length).toBe(2);
    expect(store.purposeOptions().length).toBe(1);
    expect(store.prepaymentTypeOptions().length).toBe(1);
  });

  it('should compute alert', () => {
    expect(store.alert()).toBeNull();
    store.showAlert('Test', 'success');
    expect(store.alert()?.message).toBe('Test');
  });

  it('should handle basic methods', () => {
    store.setFilter(2);
    expect(store.filterStatus()).toBe(2);
    store.clearLoanDetails();
    expect(store.selectedLoanDetails()).toBeNull();
    store.clearCalculationResult();
    expect(store.calculationResult()).toBeNull();
    store.setSearchQuery('test');
    expect(store.searchQuery()).toBe('test');
    store.reset();
    expect(store.filterStatus()).toBeNull();
    store.closeModals();
    expect(store.isDetailsOpen()).toBe(false);
  });

  it('should load loans and handle forceChange', async () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.loadLoans({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.loans().length).toBe(3);
    loansService.getAllLoans.mockClear();
    store.loadLoans({});
    expect(loansService.getAllLoans).not.toHaveBeenCalled();
    store.loadLoans({ forceChange: true });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(loansService.getAllLoans).toHaveBeenCalled();
  });

  it('should handle load errors', async () => {
    loansService.getAllLoans.mockReturnValue(
      throwError(() => new Error('Failed')),
    );
    store.loadLoans({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.error()).toBe('Failed');
  });

  it('should load and cache loan details', async () => {
    loansService.getLoanById.mockReturnValue(of(mockLoanDetails));
    store.loadLoanDetails('1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.selectedLoanDetails()).toEqual(mockLoanDetails);
    loansService.getLoanById.mockClear();
    store.loadLoanDetails('1');
    expect(loansService.getLoanById).not.toHaveBeenCalled();
  });

  it('should rename loan', async () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    loansService.updateFriendlyName.mockReturnValue(of({}));
    store.loadLoans({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    store.renameLoan({ id: '1', name: 'New' });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.loans().find((l) => l.id === '1')?.friendlyName).toBe('New');
  });

  it('should not reload months/purposes if exist', async () => {
    loansService.getLoanMonths.mockReturnValue(of([12]));
    loansService.getPurposes.mockReturnValue(
      of([{ displayText: 'Home', value: 'home' }]),
    );
    store.loadMonths({});
    store.loadPurposes({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    loansService.getLoanMonths.mockClear();
    loansService.getPurposes.mockClear();
    store.loadMonths({});
    store.loadPurposes({});
    expect(loansService.getLoanMonths).not.toHaveBeenCalled();
    expect(loansService.getPurposes).not.toHaveBeenCalled();
  });

  it('should handle calculation errors', async () => {
    loansService.calculateFullPrepayment.mockReturnValue(
      throwError(() => new Error('Calc failed')),
    );
    store.calculatePrepayment({ payload: { type: 'full', loanId: '1' } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.error()).toBe('Calc failed');
  });

  it('should auto-hide alert', async () => {
    store.showAlert('Test', 'success');
    expect(store.alertMessage()).toBe('Test');
    await new Promise((resolve) => setTimeout(resolve, 3100));
    expect(store.alertMessage()).toBeNull();
  });

  it('should open details and prepayment', async () => {
    loansService.getLoanById.mockReturnValue(of(mockLoanDetails));
    store.openDetails('1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.isDetailsOpen()).toBe(true);
    store.openPrepayment(mockLoanDetails as any);
    expect(store.isPrepaymentOpen()).toBe(true);
    expect(store.isDetailsOpen()).toBe(false);
  });

  it('should initiate prepayment', async () => {
    loansService.initiatePrepayment.mockReturnValue(
      of({ verify: { challengeId: 'ch123' } }),
    );
    store.initiatePrepayment({ payload: { loanId: '1', amount: 100 } as any });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.activeChallengeId()).toBe('ch123');
  });

  it('should handle insufficient funds', async () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { message: 'Insufficient funds in payment account' },
    });
    loansService.initiatePrepayment.mockReturnValue(throwError(() => error));
    store.initiatePrepayment({ payload: { loanId: '1', amount: 100 } as any });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.alertMessage()).toBe('Insufficient funds in payment account');
  });

  it('should handle missing challengeId', async () => {
    loansService.initiatePrepayment.mockReturnValue(of({ verify: {} } as any));
    store.initiatePrepayment({ payload: { loanId: '1', amount: 100 } as any });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.error()).toBe('No challenge ID returned');
  });

  it('should verify prepayment', async () => {
    loansService.verifyPrepayment.mockReturnValue(of({ success: true }));
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.verifyPrepayment({ payload: { challengeId: 'ch123', code: '1234' } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.activeChallengeId()).toBeNull();
  });

  it('should handle verification failure', async () => {
    loansService.verifyPrepayment.mockReturnValue(
      of({ success: false, message: 'Invalid' }),
    );
    store.verifyPrepayment({ payload: { challengeId: 'ch123', code: '1234' } });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(store.error()).toContain('Invalid');
  });

  it('should navigate details', async () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    loansService.getLoanById.mockReturnValue(of(mockLoanDetails));
    store.loadLoans({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    store.openDetails('1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    loansService.getLoanById.mockReturnValue(
      of({ ...mockLoanDetails, id: '2' }),
    );
    store.navigateDetails(1);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(loansService.getLoanById).toHaveBeenCalledWith('2');
    loansService.getLoanById.mockReturnValue(
      of({ ...mockLoanDetails, id: '1' }),
    );
    store.navigateDetails(-1);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(loansService.getLoanById).toHaveBeenCalledWith('1');
  });

  it('should handle wrap navigation', async () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    loansService.getLoanById.mockReturnValue(of(mockLoanDetails));
    store.loadLoans({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    store.openDetails('1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    loansService.getLoanById.mockReturnValue(
      of({ ...mockLoanDetails, id: '3' }),
    );
    store.navigateDetails(-1);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(loansService.getLoanById).toHaveBeenCalledWith('3');
  });

  it('should listen to global create success', async () => {
    loansService.getAllLoans.mockReturnValue(of(mockLoans));
    store.loadLoans({});
    await new Promise((resolve) => setTimeout(resolve, 10));
    loansService.getAllLoans.mockClear();
    actions$.next(LoansCreateActions.requestLoanSuccess({ loan: {} as any }));
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(loansService.getAllLoans).toHaveBeenCalled();
  });
});
