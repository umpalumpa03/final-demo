import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LoanHeader } from '../shared/ui/loan-header/loan-header';
import { LoanNavigation } from '../shared/ui/loan-navigation/loan-navigation';
import { RouterModule } from '@angular/router';
import { RequestModal } from '../shared/ui/request-modal/request-modal';
import { Store } from '@ngrx/store';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { LoansActions } from '../store/loans.actions';
import { selectLoansAlert, selectLoansLoading } from '../store/loans.selectors';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';

@Component({
  selector: 'app-loans-container',
  imports: [
    LoanHeader,
    LoanNavigation,
    RouterModule,
    RequestModal,
    Skeleton,
    SimpleAlerts,
  ],
  templateUrl: './loans-container.html',
  styleUrl: './loans-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansContainer {
  private store = inject(Store);

  protected isModalOpen = signal(false);
  protected isLoading = this.store.selectSignal(selectLoansLoading);
  protected readonly alertConfig = this.store.selectSignal(selectLoansAlert);

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
    this.store.dispatch(AccountsActions.loadAccounts());
  }
}
