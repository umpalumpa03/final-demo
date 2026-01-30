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
import { LoanDetails } from '../../../shared/ui/prepayment/loan-details/loan-details';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { LoansActions } from '../../../store/loans.actions';
import {
  selectLoanDetailsLoading,
  selectLoansWithAccountInfo,
  selectSelectedLoanDetails,
} from '../../../store/loans.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { ILoan } from '../../../shared/models/loan.model';
import { PrepaymentContainer } from '../../../shared/ui/prepayment/prepayment-container/prepayment-container';

@Component({
  selector: 'app-all-loans',
  imports: [CommonModule, LoanCard, LoanDetails, UiModal, PrepaymentContainer],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  private store = inject(Store);

  protected readonly loans = this.store.selectSignal(
    selectLoansWithAccountInfo,
  );
  protected readonly selectedLoanDetails = this.store.selectSignal(
    selectSelectedLoanDetails,
  );
  protected readonly isDetailsLoading = this.store.selectSignal(
    selectLoanDetailsLoading,
  );

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isDetailsOpen = signal(false);
  public readonly isPrepaymentOpen = signal(false);

  public ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public onCardClick(id: string): void {
    const loan = this.loans().find((l) => l.id === id);
    if (loan && loan.status === 2) {
      this.selectedLoan.set(loan);
      this.isDetailsOpen.set(true);
      this.store.dispatch(LoansActions.loadLoanDetails({ id }));
    }
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
    this.store.dispatch(LoansActions.clearLoanDetails());
  }
}
