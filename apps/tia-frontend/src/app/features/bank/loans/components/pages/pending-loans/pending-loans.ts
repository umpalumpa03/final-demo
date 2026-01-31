import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoansStore } from '../../../store/loans.store';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-loans',
  imports: [CommonModule, LoanCard, ErrorStates, TranslatePipe],
  templateUrl: './pending-loans.html',
  styleUrl: './pending-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly pendingLoans = this.store.loansWithAccountInfo;

  public ngOnInit(): void {
    this.store.loadLoans(1);
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }

  public navigateToAllLoans(): void {
    this.router.navigate(['/loans/all']);
  }
}
