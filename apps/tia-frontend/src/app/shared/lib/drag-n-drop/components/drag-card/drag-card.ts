import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  OnDestroy,
  input,
  output,
  effect,
} from '@angular/core';
import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { DraggableCard } from '../draggable-card/draggable-card';

@Component({
  selector: 'app-drag-card',
  imports: [DraggableCard],
  templateUrl: './drag-card.html',
  styleUrl: './drag-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragCard implements OnDestroy {
  public items = input.required<DraggableItemType[]>();
  public itemsChange = output<DraggableItemType[]>();
  public itemRemoved = output<string>();

  public draggingId = signal<string | null>(null);
  public dropTargetId = signal<string | null>(null);
  private startX = 0;
  private startY = 0;
  public currentX = signal(0);
  public currentY = signal(0);
  public internalItems: DraggableItemType[] = [];

  constructor() {
    effect(() => {
      this.internalItems = [...this.items()];
    });
  }

  public draggingStyle = computed(() => ({
    transform: `translate(${this.currentX()}px, ${this.currentY()}px)`,
    zIndex: 100,
  }));

  public onDragStart(id: string, event: PointerEvent): void {
    this.draggingId.set(id);
    this.startX = event.clientX;
    this.startY = event.clientY;

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  public onPointerMove = (event: PointerEvent): void => {
    this.currentX.set(event.clientX - this.startX);
    this.currentY.set(event.clientY - this.startY);

    const draggedElement = document.querySelector<HTMLElement>(
      `[data-card-id="${this.draggingId()}"]`,
    );

    if (draggedElement) {
      draggedElement.style.pointerEvents = 'none';
    }

    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY,
    );
    const cardBelow = elementBelow?.closest('[data-card-id]');
    const targetId = cardBelow?.getAttribute('data-card-id') ?? null;

    if (draggedElement) {
      draggedElement.style.pointerEvents = '';
    }

    if (targetId !== this.draggingId()) {
      this.dropTargetId.set(targetId);
    } else {
      this.dropTargetId.set(null);
    }
  };

  public onPointerUp = (): void => {
    const dragId = this.draggingId();
    const dropId = this.dropTargetId();

    if (dragId && dropId && dragId !== dropId) {
      this.reorderItems(dragId, dropId);
    }

    this.draggingId.set(null);
    this.dropTargetId.set(null);
    this.currentX.set(0);
    this.currentY.set(0);

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  public onRemove(id: string): void {
    this.internalItems = this.internalItems.filter((item) => item.id !== id);
    this.itemsChange.emit(this.internalItems);
    this.itemRemoved.emit(id);
  }

  private reorderItems(dragId: string, dropId: string): void {
    const dragIndex = this.internalItems.findIndex(
      (item) => item.id === dragId,
    );
    const dropIndex = this.internalItems.findIndex(
      (item) => item.id === dropId,
    );

    const newItems = [...this.internalItems];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    this.internalItems = newItems;
    this.itemsChange.emit(this.internalItems);
  }

  public ngOnDestroy(): void {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }
}
