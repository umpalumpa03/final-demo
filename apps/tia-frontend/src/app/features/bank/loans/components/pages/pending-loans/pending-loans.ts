import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoansStore } from '../../../store/loans.store';

@Component({
  selector: 'app-pending-loans',
  imports: [CommonModule, LoanCard],
  templateUrl: './pending-loans.html',
  styleUrl: './pending-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingLoans {
  protected readonly store = inject(LoansStore);

  protected readonly pendingLoans = this.store.loansWithAccountInfo;

  public ngOnInit(): void {
    this.store.loadLoans(1);
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }
}
