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
import { LoanDetails } from '../../../shared/ui/prepayment/loan-details/loan-details';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { PrepaymentContainer } from '../../../shared/ui/prepayment/prepayment-container/prepayment-container';

@Component({
  selector: 'app-approved-loans',
  imports: [LoanCard, CommonModule, LoanDetails, UiModal, PrepaymentContainer],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  private store = inject(Store);

  protected readonly approvedLoans$ = this.store.select(selectFilteredLoans(2));

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isPrepaymentOpen = signal(false);
  public readonly isDetailsOpen = signal(false);

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public onCardClick(id: string): void {
    this.approvedLoans$
      .pipe(
        take(1),
        map((loans) => loans.find((l) => l.id === id)),
        filter(
          (loan): loan is NonNullable<typeof loan> =>
            !!loan && loan.status === 2,
        ),
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

  public onOpenPrepayment(loan: ILoan): void {
    this.selectedLoan.set(loan);
    this.isDetailsOpen.set(false);
    this.isPrepaymentOpen.set(true);
  }

  public closeModals(): void {
    this.isDetailsOpen.set(false);
    this.isPrepaymentOpen.set(false);
    this.selectedLoan.set(null);
  }
}
