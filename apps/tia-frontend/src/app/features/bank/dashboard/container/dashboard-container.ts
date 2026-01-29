import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { DragContainer } from '@tia/shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { DragItemDirective } from '@tia/shared/lib/drag-n-drop/directives/drag-item.directive';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [DragContainer, DraggableCard, DragItemDirective],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer {
  protected readonly myItems = signal<DraggableItemType[]>([
    {
      id: '1',
      title: 'Recent Transactions',
      subtitle: 'Your latest account activity',
      icon: 'images/svg/drag-and-drop/card.svg',
    },
    {
      id: '2',
      title: 'Accounts',
      subtitle: 'Your account balances and activity',
      icon: 'images/svg/drag-and-drop/exchange.svg',
    },
    {
      id: '3',
      title: 'Exchange Rates',
      subtitle: 'Live currency exchange rates',
      icon: 'images/svg/drag-and-drop/folder.svg',
    },
  ]);

  protected readonly dynamicColspans = computed(() => {
    return this.myItems().map((_, index) => (index === 0 ? 2 : 1));
  });

  public onItemsChange(newItems: DraggableItemType[]): void {
    this.myItems.set(newItems);
  }

  public onContainerOrderChange(ids: string[]): void {
    console.log('New Order saved to DB:', ids);
  }

  onRemove(id: string) {
    this.myItems.update((items) => items.filter((i) => i.id !== id));
  }

  onEdit(id: string) {
    console.log('Editing widget:', id);
  }
}
