import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { take, map, filter } from 'rxjs';

import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoanDetails } from '../../../shared/ui/prepayment/loan-details/loan-details';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';

import { LoansActions } from '../../../store/loans.actions';
import {
  selectLoansLoading,
  selectLoansWithAccountInfo,
} from '../../../store/loans.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { ILoan } from '../../../shared/models/loan.model';
import { PrepaymentContainer } from '../../../shared/ui/prepayment/prepayment-container/prepayment-container';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-all-loans',
  imports: [
    CommonModule,
    LoanCard,
    LoanDetails,
    UiModal,
    PrepaymentContainer,
    Skeleton,
  ],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  private store = inject(Store);

  protected readonly loans = this.store.selectSignal(
    selectLoansWithAccountInfo,
  );
  protected readonly isLoading = this.store.selectSignal(selectLoansLoading);

  public readonly selectedLoan = signal<ILoan | null>(null);
  public readonly isDetailsOpen = signal(false);
  public readonly isPrepaymentOpen = signal(false);

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public onCardClick(id: string): void {
    const loan = this.loans().find((l) => l.id === id);

    if (loan && loan.status === 2) {
      this.selectedLoan.set(loan);
      this.isDetailsOpen.set(true);
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
  }
}
