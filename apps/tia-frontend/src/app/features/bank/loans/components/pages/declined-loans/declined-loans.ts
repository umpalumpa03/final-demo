import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';
import { LoansStore } from '../../../store/loans.store';

@Component({
  selector: 'app-declined-loans',
  imports: [LoanCard, CommonModule],
  templateUrl: './declined-loans.html',
  styleUrl: './declined-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclinedLoans {
  protected readonly store = inject(LoansStore);

  protected readonly declinedLoans = this.store.loansWithAccountInfo;

  public ngOnInit(): void {
    this.store.loadLoans(3);
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }
}
