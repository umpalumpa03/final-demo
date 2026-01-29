import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { DragContainer } from '@tia/shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragItemDirective } from '@tia/shared/lib/drag-n-drop/directives/drag-item.directive';
import { IWidgetItem } from '../models/widgets.model';
import { WidgetTransactions } from '../components/widget-transactions/widget-transactions';
import { WidgetAccounts } from '../components/widget-accounts/widget-accounts';
import { WidgetExchange } from '../components/widget-exchange/widget-exchange';

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
  ],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer {
  protected readonly myItems = signal<IWidgetItem[]>([
    {
      id: '1',
      title: 'Recent Transactions',
      subtitle: 'Your latest account activity',
      icon: 'images/svg/dashboard/transactions.svg',
      type: 'transactions',
    },
    {
      id: '2',
      title: 'Accounts',
      subtitle: 'Your account balances and activity',
      icon: 'images/svg/dashboard/accounts.svg',
      type: 'accounts',
    },
    {
      id: '3',
      title: 'Exchange Rates',
      subtitle: 'Live currency exchange rates',
      icon: 'images/svg/dashboard/rates.svg',
      type: 'exchange',
    },
  ]);

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
    console.log(`Widget ${id} visibility changed to:`, isVisible);
  }

  public onAddExtra(id: string): void {
    console.log(`Extra action triggered for widget: ${id}`);
  }

  public onRemove(id: string): void {
    this.myItems.update((items) => items.filter((i) => i.id !== id));
  }

  public onEdit(id: string): void {
    console.log('Editing widget:', id);
  }
}
