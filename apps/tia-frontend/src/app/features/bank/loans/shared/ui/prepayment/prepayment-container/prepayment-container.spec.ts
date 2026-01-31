import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PrepaymentContainer } from './prepayment-container';
import { LoansStore } from '../../../../store/loans.store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ILoanDetails } from '../../../models/loan.model';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';

describe('PrepaymentContainer', () => {
  let component: PrepaymentContainer;
  let fixture: ComponentFixture<PrepaymentContainer>;
  let loansStoreMock: any;

  const mockLoan = {
    id: '1',
    accountId: 'acc1',
    loanAmount: 5000,
  } as ILoanDetails;

  beforeEach(async () => {
    loansStoreMock = {
      actionLoading: signal(false),
      calculationResult: signal(null),
      activeChallengeId: signal(null),
      error: signal(null),

      clearCalculationResult: vi.fn(),
      calculatePrepayment: vi.fn(),
      initiatePrepayment: vi.fn(),
      verifyPrepayment: vi.fn(),

      loadPrepaymentOptions: vi.fn(),
      prepaymentTypeOptions: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [PrepaymentContainer, TranslateModule.forRoot()],
      providers: [{ provide: LoansStore, useValue: loansStoreMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentContainer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('loan', mockLoan);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and clear result on init', () => {
    expect(component).toBeTruthy();
    expect(loansStoreMock.clearCalculationResult).toHaveBeenCalled();
    expect(loansStoreMock.loadPrepaymentOptions).toHaveBeenCalled();
    expect(component.step()).toBe('options');
  });

  it('should call calculatePrepayment', () => {
    const payload = { type: 'partial', amount: 100 } as any;
    component.onCalculate(payload);
    expect(loansStoreMock.calculatePrepayment).toHaveBeenCalledWith({
      payload,
    });
  });

  it('should switch step to review when calculationResult updates', () => {
    loansStoreMock.calculationResult.set({ displayedInfo: [] });
    fixture.detectChanges();
    expect(component.step()).toBe('review');
  });

  it('should switch step to otp when activeChallengeId updates', () => {
    loansStoreMock.activeChallengeId.set('chal-123');
    fixture.detectChanges();
    expect(component.step()).toBe('otp');
  });

  it('should call verifyPrepayment', () => {
    loansStoreMock.activeChallengeId.set('chal-123');
    fixture.detectChanges();
    component.onVerifyOtp('1234');
    expect(loansStoreMock.verifyPrepayment).toHaveBeenCalledWith({
      payload: { challengeId: 'chal-123', code: '1234' },
    });
  });

  it('should emit close when OTP step succeeds (challenge cleared, no error)', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');

    component.step.set('otp');
    loansStoreMock.activeChallengeId.set('chal-123');
    fixture.detectChanges();

    loansStoreMock.activeChallengeId.set(null);
    loansStoreMock.error.set(null);
    fixture.detectChanges();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should initiate prepayment with correct logic', () => {
    const payload = { loanId: '1', type: 'partial', amount: 500 } as any;
    component.onCalculate(payload);

    component.onProceedToOtp();

    expect(loansStoreMock.initiatePrepayment).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        amount: 500,
        loanPrepaymentOption: 'partial',
      }),
    });
  });
});
