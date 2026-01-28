import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoansActions } from '../../../store/loans.actions';
import { selectAllLoans } from '../../../store/loans.selectors';
import { LoanDetails } from '../../../shared/ui/prepayment-wizard/loan-details/loan-details';
import { ILoan } from '../../../shared/models/loan.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-all-loans',
  imports: [CommonModule, LoanCard, LoanDetails],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  private store = inject(Store);

  protected readonly loans$ = this.store.select(selectAllLoans);

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isDetailsOpen = signal<boolean>(false);

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
  }

  public onCardClick(id: string): void {
    this.loans$.pipe(take(1)).subscribe((loans) => {
      const loan = loans.find((l) => l.id === id);

      if (loan && loan.status === 2) {
        this.selectedLoan.set(loan);
        this.isDetailsOpen.set(true);
      }
    });
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.dispatch(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  }
}
