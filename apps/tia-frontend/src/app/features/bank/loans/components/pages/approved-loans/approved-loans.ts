import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../store/loans.actions';
import {
  selectCalculationResult,
  selectFilteredLoans,
} from '../../../store/loans.selectors';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';
import { ILoan } from '../../../shared/models/loan.model';
import { filter, map, take } from 'rxjs';
import { LoanDetails } from '../../../shared/ui/prepayment-wizard/loan-details/loan-details';
import { PrepaymentCalculationPayload } from '../../../shared/models/prepayment.model';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { PrepaymentOptionStep } from '../../../shared/ui/prepayment-wizard/prepayment-options-step/prepayment-option-step';
import { PrepaymentReview } from '../../../shared/ui/prepayment-wizard/prepayment-review/prepayment-review';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-approved-loans',
  imports: [
    LoanCard,
    CommonModule,
    LoanDetails,
    UiModal,
    PrepaymentOptionStep,
    PrepaymentReview,
  ],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  private store = inject(Store);

  protected readonly approvedLoans$ = this.store.select(selectFilteredLoans(2));
  public readonly calculationResult = toSignal(
    this.store.select(selectCalculationResult),
  );

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isPrepaymentOpen = signal(false);
  public readonly isDetailsOpen = signal(false);
  public readonly step = signal<'options' | 'review'>('options');

  constructor() {
    effect(() => {
      if (this.calculationResult()) {
        this.step.set('review');
      }
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
  }

  public onCardClick(id: string): void {
    this.approvedLoans$
      .pipe(
        take(1),
        map((loans) => loans.find((l) => l.id === id)),
        filter((loan): loan is ILoan => !!loan && loan.status === 2),
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
    this.store.dispatch(LoansActions.calculatePrepayment({ payload }));
  }

  public onFinalPay(): void {
    console.log('Payment Triggered');
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
