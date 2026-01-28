import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../store/loans.actions';
import { selectFilteredLoans } from '../../../store/loans.selectors';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-declined-loans',
  imports: [LoanCard, CommonModule],
  templateUrl: './declined-loans.html',
  styleUrl: './declined-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclinedLoans {
  private store = inject(Store);

  protected readonly declinedLoans$ = this.store.select(selectFilteredLoans(3));

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
  }

  protected onRenameLoan(event: { id: string; name: string }): void {
    this.store.dispatch(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  }
}
