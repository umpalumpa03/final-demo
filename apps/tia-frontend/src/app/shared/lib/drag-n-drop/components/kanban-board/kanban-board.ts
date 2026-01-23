import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  linkedSignal,
} from '@angular/core';
import { DragBase } from '../../base/base';
import {
  BoardConfig,
  KanbanItem,
  CardMovedEvent,
  CardReorderedEvent,
} from '../../model/drag.model';
import { DraggableCard } from '../draggable-card/draggable-card';
import { KanbanService } from '../../services/kanban.service';

@Component({
  selector: 'app-kanban-board',
  imports: [DraggableCard],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoard extends DragBase {
  private readonly kanbanService = inject(KanbanService);

  public readonly boards = input.required<BoardConfig[]>();
  public readonly items = input.required<KanbanItem[]>();
  public readonly canDelete = input(false);
  public readonly boardTitle = input('Kanban Board');
  public readonly boardDescription = input(
    'Manage your tasks across different stages',
  );

  public readonly itemsChange = output<KanbanItem[]>();
  public readonly cardMoved = output<CardMovedEvent>();
  public readonly cardReordered = output<CardReorderedEvent>();
  public readonly cardRemoved = output<string>();

  public readonly internalItems = linkedSignal<KanbanItem[], KanbanItem[]>({
    source: this.items,
    computation: (newItems) => [...newItems],
  });

  public readonly itemsByBoard = computed(() =>
    this.kanbanService.groupItemsByBoard(this.boards(), this.internalItems()),
  );

  public onDragStartHandler(id: string, event: PointerEvent): void {
    this.onDragStart(id, event);
  }

  protected override handleDrop(dragId: string, dropId: string): void {
    const isBoardDrop = dropId.startsWith('board:');
    const items = this.internalItems();

    const dragItem = items.find((i) => i.id === dragId);
    if (!dragItem) return;

    let toBoardId: string;
    let targetItemId: string | undefined;

    if (isBoardDrop) {
      toBoardId = dropId.replace('board:', '');
    } else {
      const dropItem = items.find((i) => i.id === dropId);
      if (!dropItem) return;
      toBoardId = dropItem.boardId;
      targetItemId = dropId;
    }

    const updatedItems = this.kanbanService.reorderItems(
      items,
      dragId,
      toBoardId,
      targetItemId,
    );
    const newOrder = updatedItems.find((i) => i.id === dragId)?.order ?? 0;
    this.internalItems.set(updatedItems);
    this.itemsChange.emit(updatedItems);

    if (dragItem.boardId !== toBoardId) {
      this.cardMoved.emit({
        cardId: dragId,
        fromBoardId: dragItem.boardId,
        toBoardId,
        newOrder,
      });
    } else {
      this.cardReordered.emit({
        cardId: dragId,
        boardId: toBoardId,
        newOrder,
      });
    }
  }

  public onRemove(id: string): void {
    const updated = this.kanbanService.removeItem(this.internalItems(), id);
    this.internalItems.set(updated);
    this.itemsChange.emit(updated);
    this.cardRemoved.emit(id);
  }
}
