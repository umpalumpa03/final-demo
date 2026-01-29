import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DragContainer } from '@tia/shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';

@Component({
  selector: 'app-dashboard-container',
  imports: [DragContainer, DraggableCard],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer {
onRemove(arg0: string) {
throw new Error('Method not implemented.');
}
onContainerOrderChange($event: string[]) {
throw new Error('Method not implemented.');
}
onItemsChange($event: DraggableItemType[]) {
throw new Error('Method not implemented.');
}
  protected readonly myItems = [
    {
      id: '1',
      title: 'Item 1',
      subtitle: 'drag to reorder',
      icon: 'images/svg/drag-and-drop/card.svg',
    },
    {
      id: '2',
      title: 'Item 2',
      subtitle: 'drag to reorder',
      icon: 'images/svg/drag-and-drop/exchange.svg',
    },
    {
      id: '3',
      title: 'Item 3',
      subtitle: 'drag to reorder',
      icon: 'images/svg/drag-and-drop/folder.svg',
    }
  ];

  onEdit(id:string):void{}
}
