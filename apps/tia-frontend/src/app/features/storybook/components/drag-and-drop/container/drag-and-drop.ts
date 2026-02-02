import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DragCard } from '@tia/shared/lib/drag-n-drop/components/drag-card/drag-card';
import {
  DraggableItemType,
  BoardConfig,
  KanbanItem,
  CardMovedEvent,
  CardReorderedEvent,
  TreeItem,
  TreeGroupConfig,
  TreeItemMovedEvent,
  TreeItemReorderedEvent,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';
import {
  items,
  boards,
  kanbanItems,
  treeGroups,
  treeItems,
} from '../config/draggable-data.config';
import { KanbanBoard } from '@tia/shared/lib/drag-n-drop/components/kanban-board/kanban-board';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { InstructionsCard } from '../instructions-card/instructions-card';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/components/draggable-card/draggable-card';
import { DragContainer } from '@tia/shared/lib/drag-n-drop/components/drag-container/drag-container';
import { DragItemDirective } from '@tia/shared/lib/drag-n-drop/directives/drag-item.directive';
import { TreeContainer } from '@tia/shared/lib/drag-n-drop/components/tree-container/tree-container';
import { TranslatePipe } from '@ngx-translate/core';

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
    TreeContainer,
    TranslatePipe,
  ],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropContainer {
  public items: DraggableItemType[] = [...items];
  public listItems: DraggableItemType[] = [...items];
  public boards: BoardConfig[] = [...boards];
  public kanbanItems: KanbanItem[] = [...kanbanItems];
  public myItems: DraggableItemType[] = [...items];
  public treeGroups: TreeGroupConfig[] = [...treeGroups];
  public treeItems: TreeItem[] = [...treeItems];
  public canDelete = true;

  public onItemRemoved(id: string): void {}

  public onOrderChange(ids: string[]): void {}

  public onOrderChangeList(ids: string[]): void {}

  public onCardMoved(event: CardMovedEvent): void {}

  public onCardReordered(event: CardReorderedEvent): void {}

  public onCardRemoved(id: string): void {}

  public onItemEdited(id: string): void {}

  public onItemAdded(id: string): void {}

  public onViewOptionChanged(event: {
    id: string;
    isViewable: boolean;
  }): void {}

  public onPaginationChanged(event: { id: string; value: number }): void {}

  public onItemsChange(items: DraggableItemType[]): void {
    this.myItems = items;
  }

  public onRemove(id: string): void {}

  public onEdit(id: string): void {}

  public onContainerOrderChange(ids: string[]): void {}

  public onTreeGroupsChange(groups: TreeGroupConfig[]): void {
    this.treeGroups = groups;
  }

  public onTreeItemsChange(items: TreeItem[]): void {
    this.treeItems = items;
  }

  public onTreeItemMoved(event: TreeItemMovedEvent): void {}

  public onTreeItemReordered(event: TreeItemReorderedEvent): void {}

  public onTreeExpandedChange(event: { id: string; expanded: boolean }): void {}

  public onCheckedItemsChange(itemIds: string[]): void {}

  public movenotAllowed(event: boolean): void {
    console.log(event);
  }
}
