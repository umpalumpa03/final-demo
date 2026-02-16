import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { PrepaymentOptionStep } from '../prepayment-options-step/prepayment-option-step';
import { PrepaymentReview } from '../prepayment-review/prepayment-review';
import { Verify } from '../verify/verify';
import { ILoanDetails } from '../../../models/loan.model';
import {
  PrepaymentStep,
  PrepaymentCalculationPayload,
  IInitiatePrepaymentRequest,
} from '../../../models/prepayment.model';
import { LoansStore } from '../../../../store/loans.store';

@Component({
  selector: 'app-prepayment-container',
  imports: [CommonModule, PrepaymentOptionStep, PrepaymentReview, Verify],
  templateUrl: './prepayment-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentContainer implements OnInit {
  protected readonly store = inject(LoansStore);

  public loan = input.required<ILoanDetails>();
  public close = output<void>();

  public isLoading = this.store.actionLoading;
  public calculationResult = this.store.calculationResult;
  public activeChallengeId = this.store.activeChallengeId;

  public error = this.store.error;

  public step = signal<PrepaymentStep>('options');
  private pendingPayload: PrepaymentCalculationPayload | null = null;

  constructor() {
    effect(() => {
      if (this.calculationResult()) this.step.set('review');
    });

    effect(() => {
      if (this.activeChallengeId()) {
        this.step.set('otp');
      }
    });

    effect(() => {
      const id = this.activeChallengeId();
      const currentStep = this.step();
      const error = this.store.error();

      if (currentStep === 'otp' && !id && !error) {
        this.close.emit();
      }
    });
  }

  public ngOnInit(): void {
    this.store.clearCalculationResult();
    this.step.set('options');
  }

  public onCalculate(payload: PrepaymentCalculationPayload): void {
    this.pendingPayload = payload;
    this.store.calculatePrepayment({ payload });
  }

  public onProceedToOtp(): void {
    if (!this.pendingPayload) return;

    let finalAmount = this.pendingPayload.amount;

    if (this.pendingPayload.type === 'full') {
      const calcData = this.calculationResult()?.displayedInfo;
      const principalItem = calcData?.find(
        (x) => x.text === 'Remaining principal',
      );
      finalAmount = principalItem ? principalItem.amount : 0;
    }

    const request: IInitiatePrepaymentRequest = {
      loanId: this.pendingPayload.loanId,
      loanPrepaymentOption: this.pendingPayload.type,
      loanPartialPaymentType:
        this.pendingPayload.loanPartialPaymentType || 'reduceMonthlyPayment',
      amount: finalAmount || 0,
      paymentAccountId: this.loan().accountId,
    };

    this.store.initiatePrepayment({ payload: request });
  }

  public onVerifyOtp(code: string): void {
    const challengeId = this.activeChallengeId();
    if (challengeId) {
      this.store.verifyPrepayment({
        payload: {
          challengeId: challengeId,
          code: code,
        },
      });
    }
  }

  public resendOtp(): void {
    const challengeId = this.activeChallengeId();
    if (!challengeId) return;

    this.store.resendOtp({ challengeId });
  }
}
