import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../store/loans.actions';
import { selectFilteredLoans } from '../../../store/loans.selectors';

@Component({
  selector: 'app-pending-loans',
  imports: [CommonModule, LoanCard],
  templateUrl: './pending-loans.html',
  styleUrl: './pending-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingLoans {
  private store = inject(Store);

  protected readonly pendingLoans$ = this.store.select(selectFilteredLoans(1));

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.dispatch(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  }
}
