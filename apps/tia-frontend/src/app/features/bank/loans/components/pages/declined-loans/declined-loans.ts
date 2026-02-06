import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';
import { LoansStore } from '../../../store/loans.store';
import { TranslatePipe } from '@ngx-translate/core';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { Router } from '@angular/router';
import { LoanDetails } from '../../../shared/ui/prepayment/loan-details/loan-details';
import { ILoan } from '../../../shared/models/loan.model';

@Component({
  selector: 'app-declined-loans',
  imports: [LoanCard, CommonModule, ErrorStates, TranslatePipe, LoanDetails],
  templateUrl: './declined-loans.html',
  styleUrl: './declined-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclinedLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly declinedLoans = this.store.filteredLoans;
  protected readonly selectedLoanDetails = this.store.selectedLoanDetails;
  protected readonly isDetailsLoading = this.store.detailsLoading;

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isDetailsOpen = signal(false);

  public ngOnInit(): void {
    this.store.loadLoans({ status: 3 });
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }

  public onCardClick(id: string): void {
    const loan = this.declinedLoans().find((l) => l.id === id);

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
