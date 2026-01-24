import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DragCard } from '@tia/shared/lib/drag-n-drop/components/drag-card/drag-card';
import {
  DraggableItemType,
  BoardConfig,
  KanbanItem,
  CardMovedEvent,
  CardReorderedEvent,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { items } from 'apps/tia-frontend/src/app/features/admin/components/library/components/drag-and-drop/config/draggable-data.config';
import {
  boards,
  kanbanItems,
} from 'apps/tia-frontend/src/app/features/admin/components/library/components/drag-and-drop/config/draggable-data.config';
import { KanbanBoard } from '@tia/shared/lib/drag-n-drop/components/kanban-board/kanban-board';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { InstructionsCard } from '../instructions-card/instructions-card';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragContainer } from '@tia/shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DragItemDirective } from '@tia/shared/lib/drag-n-drop/directives/drag-item.directive';

@Component({
  selector: 'app-drag-and-drop-container',
  imports: [
    DragCard,
    KanbanBoard,
    LibraryTitle,
    InstructionsCard,
    DraggableCard,
    DragContainer,
    DragItemDirective,
  ],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropContainer {
  // grid layout items
  public items: DraggableItemType[] = [...items];
  // list layout items
  public listItems: DraggableItemType[] = [...items];

  // kanban board columns
  public boards: BoardConfig[] = [...boards];
  // kanban cards
  public kanbanItems: KanbanItem[] = [...kanbanItems];

  public myItems: DraggableItemType[] = [...items];
  public canDelete = true;

  // grid card deleted
  public onItemRemoved(id: string): void {}

  // grid order changed
  public onOrderChange(ids: string[]): void {}

  // list order changed
  public onOrderChangeList(ids: string[]): void {}

  // card moved to different board
  public onCardMoved(event: CardMovedEvent): void {}

  // card reordered within same board
  public onCardReordered(event: CardReorderedEvent): void {}

  // kanban card deleted
  public onCardRemoved(id: string): void {}

  // edit button clicked
  public onItemEdited(id: string): void {}

  // add button clicked
  public onItemAdded(id: string): void {}

  // eye toggle clicked
  public onViewOptionChanged(event: {
    id: string;
    isViewable: boolean;
  }): void {}

  // pagination dropdown changed
  public onPaginationChanged(event: { id: string; value: number }): void {}

  //drag container
  public onItemsChange(items: DraggableItemType[]): void {
    this.myItems = items;
  }
  // outputs directly from draggable card
  public onRemove(id: string): void {}
  public onEdit(id: string): void {}
  public onContainerOrderChange(ids: string[]): void {}
}
