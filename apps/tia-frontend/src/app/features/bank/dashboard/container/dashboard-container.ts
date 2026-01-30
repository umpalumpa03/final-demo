import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed, OnInit, inject
} from '@angular/core';
import { DragContainer } from '../../../../shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DraggableCard } from '../../../../shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragItemDirective } from '../../../../shared/lib/drag-n-drop/directives/drag-item.directive';
import { IWidgetItem } from '../models/widgets.model';
import { WidgetTransactions } from '../components/widget-transactions/widget-transactions';
import { WidgetAccounts } from '../components/widget-accounts/widget-accounts';
import { WidgetExchange } from '../components/widget-exchange/widget-exchange';
import { widgetItems } from '../config/widgets.config';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { Store } from '@ngrx/store';
import {
  clearExchangeRates,
  loadExchangeRates
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [
    DragContainer,
    DraggableCard,
    DragItemDirective,
    WidgetTransactions,
    WidgetAccounts,
    WidgetExchange,
    LibraryTitle,
  ],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly myItems = signal<(IWidgetItem & { isHidden?: boolean })[]>(
    [...widgetItems],
  );

  protected readonly dynamicColspans = computed(() => {
    return this.myItems().map((_, index) => (index === 0 ? 2 : 1));
  });

  public onItemsChange(newItems: IWidgetItem[]): void {
    this.myItems.set(newItems);
  }

  public onContainerOrderChange(ids: string[]): void {
    console.log('New Order saved to DB:', ids);
  }

  public onToggleVisibility(isVisible: boolean, id: string): void {
    console.log(`Vaxtangam daahaida widget ${id}`);
    this.myItems.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isHidden: !isVisible } : item,
      ),
    );
  }

  public onWidgetRefresh(item: IWidgetItem): void {
    this.store.dispatch(clearExchangeRates())
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
  }

  public onWidgetAdd(item: IWidgetItem): void {
    this.router.navigate(['/bank/products/accounts']);
  }

  public onPaginationChange(item: number): void {
    this.store.dispatch(TransactionActions.updateFilters({
      filters: { pageLimit: item }
    }));
  }

  ngOnInit() {
    this.store.dispatch(TransactionActions.updateFilters({
      filters: { pageLimit: 10 }
    }));
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
    this.store.dispatch(AccountsActions.loadAccounts());
  }
}
