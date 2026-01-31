import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoansStore } from './loans.store';
import { LoansService } from '../shared/services/loans.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoansStore', () => {
  let store: InstanceType<typeof LoansStore>;
  let loansServiceMock: any;
  let mockStore: MockStore;
  let actions$: Subject<Action>;

  const mockLoan = {
    id: '1',
    accountId: 'acc1',
    status: 1,
    purpose: 'personal',
    friendlyName: 'My Loan',
    loanAmount: 1000,
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
      calculatePartialPrepayment: vi.fn().mockReturnValue(of({})),
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
              value: [{ id: 'acc1', friendlyName: 'Acc' }],
            },
          ],
        }),
        provideMockActions(() => actions$),
      ],
    });

    store = TestBed.inject(LoansStore);
    mockStore = TestBed.inject(MockStore);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with default state', () => {
    expect(store.loans()).toEqual([]);
    expect(store.loading()).toBe(false);
  });

  describe('Computed Signals', () => {
    it('should compute loansWithAccountInfo correctly', () => {
      store.loadLoans();
      TestBed.tick();
      expect(store.loansWithAccountInfo()[0].accountName).toBe('Acc');
    });

    it('should compute loanCounts correctly', () => {
      store.loadCounts();
      TestBed.tick();
      expect(store.loanCounts().all).toBe(1);
    });

    it('should compute filteredLoans', () => {
      store.loadLoans();
      TestBed.tick();
      store.setFilter(1);
      expect(store.filteredLoans().length).toBe(1);
    });
  });

  describe('Methods', () => {
    it('should load loans successfully', () => {
      store.loadLoans(1);
      TestBed.tick();
      expect(loansServiceMock.getAllLoans).toHaveBeenCalledWith(1);
      expect(store.loans().length).toBe(1);
    });

    it('should handle load loans error', () => {
      loansServiceMock.getAllLoans.mockReturnValue(
        throwError(() => new Error('Err')),
      );
      store.loadLoans();
      TestBed.tick();
      expect(store.error()).toBe('Err');
    });

    it('should rename loan', () => {
      store.loadLoans();
      TestBed.tick();
      store.renameLoan({ id: '1', name: 'New' });
      TestBed.tick();
      expect(store.loans()[0].friendlyName).toBe('New');
    });

    it('should calculate full prepayment', () => {
      store.calculatePrepayment({ payload: { loanId: '1', type: 'full' } });
      TestBed.tick();
      expect(loansServiceMock.calculateFullPrepayment).toHaveBeenCalled();
    });

    it('should calculate partial prepayment', () => {
      store.calculatePrepayment({
        payload: {
          loanId: '1',
          type: 'partial',
          amount: 50,
          loanPartialPaymentType: 'A',
        },
      });
      TestBed.tick();
      expect(loansServiceMock.calculatePartialPrepayment).toHaveBeenCalled();
    });

    it('should initiate prepayment and trigger alert', () => {
      store.initiatePrepayment({ payload: { loanId: '1' } });
      TestBed.tick();
      expect(store.activeChallengeId()).toBe('chal-123');
      expect(store.alertMessage()).toBeTruthy();
    });

    it('should verify prepayment and reload data', () => {
      store.verifyPrepayment({ payload: { challengeId: 'c', code: '1' } });
      TestBed.tick();
      expect(loansServiceMock.verifyPrepayment).toHaveBeenCalled();
      expect(loansServiceMock.getAllLoans).toHaveBeenCalled();
    });

    it('should handle insufficient funds error (400)', () => {
      const errorResponse = new HttpErrorResponse({
        status: 400,
        error: { message: 'Insufficient funds in payment account' },
      });

      loansServiceMock.initiatePrepayment.mockReturnValue(
        throwError(() => errorResponse),
      );

      store.initiatePrepayment({ payload: { loanId: '1', amount: 5000 } });
      TestBed.tick();

      expect(store.actionLoading()).toBe(false);
      expect(store.alertMessage()).toBe(
        'Insufficient funds in payment account',
      );
      expect(store.alertType()).toBe('error');

      vi.advanceTimersByTime(3000);
      expect(store.alertMessage()).toBeNull();
    });

    it('should auto hide alert using Vitest timers', () => {
      store.showAlert('test', 'success');
      TestBed.tick();

      expect(store.alertMessage()).toBe('test');

      vi.advanceTimersByTime(3000);

      expect(store.alertMessage()).toBeNull();
    });

    it('should clear calculation state', () => {
      store.clearCalculationResult();
      expect(store.calculationResult()).toBeNull();
      expect(store.activeChallengeId()).toBeNull();
    });
  });
});
