import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';
import { ILoan, ILoanDetails } from '../../../shared/models/loan.model';
import { LoanDetails } from '../../../shared/ui/prepayment/loan-details/loan-details';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { PrepaymentContainer } from '../../../shared/ui/prepayment/prepayment-container/prepayment-container';
import { LoansStore } from '../../../store/loans.store';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approved-loans',
  imports: [
    LoanCard,
    CommonModule,
    LoanDetails,
    UiModal,
    PrepaymentContainer,
    ErrorStates,
    TranslatePipe,
  ],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly approvedLoans = this.store.loansWithAccountInfo;
  protected readonly selectedLoanDetails = this.store.selectedLoanDetails;
  protected readonly isDetailsLoading = this.store.detailsLoading;

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly prepaymentLoan = signal<ILoanDetails | null>(null);
  public readonly isPrepaymentOpen = signal(false);
  public readonly isDetailsOpen = signal(false);

  public ngOnInit(): void {
    this.store.loadLoans(2);
  }

  public onCardClick(id: string): void {
    const loan = this.approvedLoans().find((l) => l.id === id);

    if (loan) {
      this.selectedLoan.set(loan);
      this.isDetailsOpen.set(true);
      this.store.loadLoanDetails(id);
    }
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }

  public onOpenPrepayment(loan: ILoanDetails): void {
    this.selectedLoan.set(loan);
    this.prepaymentLoan.set(loan);
    this.isDetailsOpen.set(false);
    this.isPrepaymentOpen.set(true);
  }

  public closeModals(): void {
    this.isDetailsOpen.set(false);
    this.isPrepaymentOpen.set(false);
    this.prepaymentLoan.set(null);
    this.selectedLoan.set(null);
    this.store.clearLoanDetails();
  }

  public navigateToAllLoans(): void {
    this.router.navigate(['bank/loans/all']);
  }
}
