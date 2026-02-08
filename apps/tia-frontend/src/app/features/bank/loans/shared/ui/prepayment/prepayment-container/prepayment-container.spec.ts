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
      prepaymentTypeOptions: signal([]),
      clearCalculationResult: vi.fn(),
      calculatePrepayment: vi.fn(),
      initiatePrepayment: vi.fn(),
      verifyPrepayment: vi.fn(),

      loadPrepaymentOptions: vi.fn(),
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

  it('should close modal if on otp step, challenge is gone, and no error', () => {
    const spy = vi.spyOn(component.close, 'emit');

    component.step.set('otp');
    loansStoreMock.activeChallengeId.set(null);
    loansStoreMock.error.set(null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should NOT close modal if error exists', () => {
    const spy = vi.spyOn(component.close, 'emit');

    component.step.set('otp');
    loansStoreMock.activeChallengeId.set(null);
    loansStoreMock.error.set('Invalid Code');

    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call verifyPrepayment', () => {
    loansStoreMock.activeChallengeId.set('chal-123');
    fixture.detectChanges();
    component.onVerifyOtp('1234');
    expect(loansStoreMock.verifyPrepayment).toHaveBeenCalledWith({
      payload: { challengeId: 'chal-123', code: '1234' },
    });
  });

  it('should initiate prepayment with correct logic (Full Payment)', () => {
    loansStoreMock.calculationResult.set({
      displayedInfo: [{ text: 'Remaining principal', amount: 999 }],
    });

    const payload = { loanId: '1', type: 'full' } as any;
    component.onCalculate(payload);
    fixture.detectChanges();

    component.onProceedToOtp();

    expect(loansStoreMock.initiatePrepayment).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        amount: 999,
        loanPrepaymentOption: 'full',
      }),
    });
  });
});
