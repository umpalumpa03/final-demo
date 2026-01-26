import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectIsLoading,
  selectTableConfig,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionsTable } from '../components/transactions-table/transactions-table';

@Component({
  selector: 'app-transactions-container',
  imports: [TransactionsTable],
  templateUrl: './transactions-container.html',
  styleUrl: './transactions-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsContainer implements OnInit {
  private store = inject(Store);

  public rawTransactions = this.store.selectSignal(selectTableConfig);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);

  ngOnInit(): void {
    this.store.dispatch(TransactionActions.enter());
  }
  public onScroll(event: Event): void {
    const el = event.target as HTMLElement;

    if (!el) return;

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 20) {
      if (!this.isLoading()) {
        this.store.dispatch(TransactionActions.loadMore());
      }
    }
  }
}
