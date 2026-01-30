import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
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
export class DashboardContainer {
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
    console.log(`Vaxtanga arefreshebs: ${item.title}`);
  }

  public onWidgetAdd(item: IWidgetItem): void {
    console.log(`Vaxtanga amatebs acaunts: ${item.type}`);
  }

  public onPaginationChange(item: number): void {
    console.log(`Vaxtangas paginacia shoucvalien ${item}`);
  }

  // console logebi aris droebiti
}
