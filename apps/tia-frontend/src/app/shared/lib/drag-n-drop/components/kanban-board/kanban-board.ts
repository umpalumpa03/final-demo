import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  linkedSignal,
} from '@angular/core';
import { DragBase } from '../../base/drag-base';
import {
  BoardConfig,
  KanbanItem,
  CardMovedEvent,
  CardReorderedEvent,
} from '../../model/drag.model';
import { DraggableCard } from '../draggable-card/draggable-card';
import { KanbanService } from '../../services/kanban.service';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';

@Component({
  selector: 'app-kanban-board',
  imports: [DraggableCard],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoard extends DragBase {
  private readonly kanbanService = inject(KanbanService);

  // data
  public readonly boards = input.required<BoardConfig[]>();
  public readonly items = input.required<KanbanItem[]>();
  public readonly boardTitle = input('Kanban Board');
  public readonly boardDescription = input(
    'Manage your tasks across different stages',
  );

  // draggable card inputs
  public readonly canDelete = input(false);
  public readonly editable = input(false);
  public readonly hasButton = input(false);
  public readonly buttonVariant = input<ButtonVariant>('ghost');
  public readonly buttonContent = input('Play');
  public readonly hasAddOption = input(false);
  public readonly hasViewOption = input(false);
  public readonly hasPagination = input(false);
  public readonly paginationVariants = input<number[]>([10, 20, 40]);
  public readonly hasCheckbox = input(false);

  // data outputs
  public readonly itemsChange = output<KanbanItem[]>();
  public readonly cardMoved = output<CardMovedEvent>();
  public readonly cardReordered = output<CardReorderedEvent>();

  // draggable card outputs
  public readonly cardRemoved = output<string>();
  public readonly cardEdited = output<string>();
  public readonly cardAdded = output<string>();
  public readonly viewOptionChanged = output<{
    id: string;
    isViewable: boolean;
  }>();
  public readonly paginationChanged = output<{ id: string; value: number }>();
  public readonly buttonClicked = output<string>();
  public readonly checkedChanged = output<{ id: string; checked: boolean }>();

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

  public onEdit(id: string): void {
    this.cardEdited.emit(id);
  }

  public onAdd(id: string): void {
    this.cardAdded.emit(id);
  }

  public onViewOptionChange(id: string, isViewable: boolean): void {
    this.viewOptionChanged.emit({ id, isViewable });
  }

  public onPaginationChange(id: string, value: number): void {
    this.paginationChanged.emit({ id, value });
  }

  public onButtonClick(id: string): void {
    this.buttonClicked.emit(id);
  }

  public onCheckedChange(id: string, checked: boolean): void {
    this.checkedChanged.emit({ id, checked });
  }
}
