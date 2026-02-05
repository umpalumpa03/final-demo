import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoansStore } from '../../../store/loans.store';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoanDetails } from '../../../shared/ui/prepayment/loan-details/loan-details';
import { ILoan, ILoanDetails } from '../../../shared/models/loan.model';

@Component({
  selector: 'app-pending-loans',
  imports: [CommonModule, LoanCard, ErrorStates, TranslatePipe, LoanDetails],
  templateUrl: './pending-loans.html',
  styleUrl: './pending-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly pendingLoans = this.store.filteredLoans;
  protected readonly selectedLoanDetails = this.store.selectedLoanDetails;
  protected readonly isDetailsLoading = this.store.detailsLoading;

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly prepaymentLoan = signal<ILoanDetails | null>(null);
  public readonly isPrepaymentOpen = signal(false);
  public readonly isDetailsOpen = signal(false);

  public ngOnInit(): void {
    this.store.loadLoans({ status: 1 });
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }

  public onCardClick(id: string): void {
    const loan = this.pendingLoans().find((l) => l.id === id);

    if (loan) {
      this.selectedLoan.set(loan);
      this.isDetailsOpen.set(true);
      this.store.loadLoanDetails(id);
    }
  }

  public closeModals(): void {
    this.isDetailsOpen.set(false);
    this.store.clearLoanDetails();
  }

  public navigateToAllLoans(): void {
    this.router.navigate(['bank/loans/all']);
  }
}
