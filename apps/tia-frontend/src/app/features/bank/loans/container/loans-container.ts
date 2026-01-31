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
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { LoansStore } from '../store/loans.store';

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
  private globalStore = inject(Store);

  protected readonly store = inject(LoansStore);

  protected isModalOpen = signal(false);

  protected isLoading = this.store.loading;
  protected readonly alertConfig = this.store.alert;

  public ngOnInit(): void {
    this.globalStore.dispatch(AccountsActions.loadAccounts());

    this.store.loadMonths();
    this.store.loadPurposes();

    this.store.loadCounts();
  }
}
