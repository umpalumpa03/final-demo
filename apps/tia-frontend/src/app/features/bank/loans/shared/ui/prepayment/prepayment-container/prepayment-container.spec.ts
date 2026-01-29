import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentContainer } from './prepayment-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansActions } from '../../../../store/loans.actions';
import {
  selectActiveChallengeId,
  selectCalculationResult,
} from '../../../../store/loans.selectors';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ILoan } from '../../../models/loan.model';

describe('PrepaymentContainer', () => {
  let component: PrepaymentContainer;
  let fixture: ComponentFixture<PrepaymentContainer>;
  let store: MockStore;

  const mockLoan = { id: '1', accountId: 'acc1', loanAmount: 5000 } as ILoan;

  const initialState = {
    loans_local: {
      loans: [],
      loading: false,
      error: null,
      months: [],
      purposes: [],
      prepaymentOptions: [],
      calculationResult: null,
      activeChallengeId: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentContainer],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectCalculationResult, value: null },
            { selector: selectActiveChallengeId, value: null },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PrepaymentContainer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('loan', mockLoan);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear calculation result on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      LoansActions.clearCalculationResult(),
    );
    expect(component.step()).toBe('options');
  });

  it('should dispatch calculatePrepayment on calculate', () => {
    const payload = { type: 'partial', amount: 100 } as any;
    component.onCalculate(payload);
    expect(store.dispatch).toHaveBeenCalledWith(
      LoansActions.calculatePrepayment({ payload }),
    );
  });

  it('should update step to review when calculation result exists', () => {
    store.overrideSelector(selectCalculationResult, {
      monthlyPayment: 10,
    } as any);
    store.refreshState();
    fixture.detectChanges();
    expect(component.step()).toBe('review');
  });

  it('should update step to otp when challengeId exists', () => {
    store.overrideSelector(selectActiveChallengeId, '123');
    store.refreshState();
    fixture.detectChanges();
    expect(component.step()).toBe('otp');
  });

  it('should dispatch verifyPrepayment on verify otp', () => {
    store.overrideSelector(selectActiveChallengeId, '123');
    store.refreshState();
    fixture.detectChanges();
    component.onVerifyOtp('1234');
    expect(store.dispatch).toHaveBeenCalledWith(
      LoansActions.verifyPrepayment({
        payload: { challengeId: '123', code: '1234' },
      }),
    );
  });

  it('should proceed to otp with correct payload for partial', () => {
    const payload = {
      type: 'partial',
      amount: 500,
      loanId: '1',
      loanPartialPaymentType: 'reduce_term',
    } as any;
    component.onCalculate(payload);
    component.onProceedToOtp();

    expect(store.dispatch).toHaveBeenCalledWith(
      LoansActions.initiatePrepayment({
        payload: {
          loanId: '1',
          loanPrepaymentOption: 'partial',
          loanPartialPaymentType: 'reduce_term',
          amount: 500,
          paymentAccountId: 'acc1',
        },
      }),
    );
  });

  it('should proceed to otp with payoff amount for full', () => {
    const payload = { type: 'full', loanId: '1' } as any;
    component.onCalculate(payload);
    store.overrideSelector(selectCalculationResult, {
      displayedInfo: [{ text: 'Total payoff amount', amount: 5000 }],
    } as any);
    store.refreshState();
    fixture.detectChanges();

    component.onProceedToOtp();

    expect(store.dispatch).toHaveBeenCalledWith(
      LoansActions.initiatePrepayment({
        payload: {
          loanId: '1',
          loanPrepaymentOption: 'full',
          loanPartialPaymentType: 'reduceMonthlyPayment',
          amount: 5000,
          paymentAccountId: 'acc1',
        },
      }),
    );
  });
});
