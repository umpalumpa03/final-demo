import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../store/loans.actions';
import { selectFilteredLoans } from '../../../store/loans.selectors';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';
import { ILoan } from '../../../shared/models/loan.model';
import { filter, map, take } from 'rxjs';
import { LoanDetails } from '../../../shared/ui/prepayment-wizard/loan-details/loan-details';

@Component({
  selector: 'app-approved-loans',
  imports: [LoanCard, CommonModule, LoanDetails],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  private store = inject(Store);

  protected readonly approvedLoans$ = this.store.select(selectFilteredLoans(2));

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isDetailsOpen = signal<boolean>(false);

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
}
