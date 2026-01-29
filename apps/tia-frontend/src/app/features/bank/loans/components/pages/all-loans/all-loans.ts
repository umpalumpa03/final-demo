import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoansActions } from '../../../store/loans.actions';
import {
  selectActiveChallengeId,
  selectCalculationResult,
  selectLoansWithAccountInfo,
} from '../../../store/loans.selectors';
import { LoanDetails } from '../../../shared/ui/prepayment-wizard/loan-details/loan-details';
import { ILoan } from '../../../shared/models/loan.model';
import { filter, map, take } from 'rxjs';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { PrepaymentOptionStep } from '../../../shared/ui/prepayment-wizard/prepayment-options-step/prepayment-option-step';
import {
  IInitiatePrepaymentRequest,
  PrepaymentCalculationPayload,
  PrepaymentStep,
} from '../../../shared/models/prepayment.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PrepaymentReview } from '../../../shared/ui/prepayment-wizard/prepayment-review/prepayment-review';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Verify } from '../../../shared/ui/prepayment-wizard/verify/verify';

@Component({
  selector: 'app-all-loans',
  imports: [
    CommonModule,
    LoanCard,
    LoanDetails,
    UiModal,
    PrepaymentOptionStep,
    PrepaymentReview,
    Verify,
  ],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  private store = inject(Store);
  private pendingPayload: PrepaymentCalculationPayload | null = null;

  protected readonly loans$ = this.store.select(selectLoansWithAccountInfo);
  public readonly calculationResult = this.store.selectSignal(
    selectCalculationResult,
  );

  public readonly activeChallengeId = this.store.selectSignal(
    selectActiveChallengeId,
  );

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isDetailsOpen = signal(false);
  public readonly isPrepaymentOpen = signal(false);
  public readonly step = signal<PrepaymentStep>('options');

  constructor() {
    effect(() => {
      if (this.calculationResult()) {
        this.step.set('review');
      }
    });
    effect(() => {
      if (this.activeChallengeId()) {
        this.step.set('otp');
      }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public onCardClick(id: string): void {
    this.loans$
      .pipe(
        take(1),
        map((loans) => loans.find((l) => l.id === id)),
        filter(
          (loan): loan is NonNullable<typeof loan> =>
            !!loan && loan.status === 2,
        ),
      )
      .subscribe((loan) => {
        this.selectedLoan.set(loan);
        this.isDetailsOpen.set(true);
      });
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.dispatch(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  }

  public onOpenPrepayment(loan: ILoan): void {
    this.selectedLoan.set(loan);
    this.isDetailsOpen.set(false);

    this.step.set('options');
    this.store.dispatch(LoansActions.clearCalculationResult());

    this.isPrepaymentOpen.set(true);
  }

  public onCalculatePrepayment(payload: PrepaymentCalculationPayload): void {
    this.pendingPayload = payload;
    this.store.dispatch(LoansActions.calculatePrepayment({ payload }));
  }

  public onProceedToOtp(): void {
    if (!this.pendingPayload) return;

    const request: IInitiatePrepaymentRequest = {
      loanId: this.pendingPayload.loanId,
      loanPrepaymentOption: this.pendingPayload.type,
      loanPartialPaymentType: this.pendingPayload.loanPartialPaymentType,
      amount: this.pendingPayload.amount,
      paymentAccountId: this.selectedLoan()!.accountId,
    };

    this.store.dispatch(LoansActions.initiatePrepayment({ payload: request }));
  }

  public onVerifyOtp(code: string): void {
    const challengeId = this.activeChallengeId();

    if (!challengeId) return;

    this.store.dispatch(
      LoansActions.verifyPrepayment({
        payload: { challengeId, code },
      }),
    );
  }

  public onFinalPay(): void {
    this.closeModals();
  }

  public closeModals(): void {
    this.isDetailsOpen.set(false);
    this.isPrepaymentOpen.set(false);
    this.selectedLoan.set(null);
    this.step.set('options');
    this.store.dispatch(LoansActions.clearCalculationResult());
  }
}
