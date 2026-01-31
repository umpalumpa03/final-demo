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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../../store/loans.actions';
import {
  selectCalculationResult,
  selectActiveChallengeId,
  selectActionLoading,
} from '../../../../store/loans.selectors';
import { ILoanDetails } from '../../../models/loan.model';
import {
  PrepaymentStep,
  PrepaymentCalculationPayload,
  IInitiatePrepaymentRequest,
} from '../../../models/prepayment.model';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-prepayment-container',
  imports: [CommonModule, PrepaymentOptionStep, PrepaymentReview, Verify],
  templateUrl: './prepayment-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentContainer implements OnInit {
  private store = inject(Store);
  private actions$ = inject(Actions);

  public loan = input.required<ILoanDetails>();
  public close = output<void>();

  public isLoading = this.store.selectSignal(selectActionLoading);
  public calculationResult = this.store.selectSignal(selectCalculationResult);
  public activeChallengeId = this.store.selectSignal(selectActiveChallengeId);

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

    this.actions$
      .pipe(ofType(LoansActions.verifyPrepaymentSuccess), takeUntilDestroyed())
      .subscribe(() => {
        this.close.emit();
      });
  }

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.clearCalculationResult());
    this.step.set('options');
  }

  public onCalculate(payload: PrepaymentCalculationPayload): void {
    this.pendingPayload = payload;
    this.store.dispatch(LoansActions.calculatePrepayment({ payload }));
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

    this.store.dispatch(LoansActions.initiatePrepayment({ payload: request }));
  }

  public onVerifyOtp(code: string): void {
    const challengeId = this.activeChallengeId();
    if (challengeId) {
      this.store.dispatch(
        LoansActions.verifyPrepayment({ payload: { challengeId, code } }),
      );
    }
  }
}
