import {
  signal,
  computed,
  OnDestroy,
  Directive,
  inject,
  ElementRef,
  input,
} from '@angular/core';
import { LayoutType, ResponsiveColumns } from '../model/drag.model';

@Directive()
export abstract class DragBase implements OnDestroy {
  protected containerRef = inject(ElementRef);
  public readonly layout = input<LayoutType>('grid');
  public readonly columns = input<number | ResponsiveColumns>(2);

  public draggingId = signal<string | null>(null);
  public dropTargetId = signal<string | null>(null);
  protected currentX = signal(0);
  protected currentY = signal(0);
  private startX = 0;
  private startY = 0;

  public readonly draggingStyle = computed(() => ({
    transform: `translate(${this.currentX()}px, ${this.currentY()}px)`,
    zIndex: 100,
  }));
  protected readonly containerStyles = computed(() => {
    if (this.layout() !== 'grid') return null;

    const cols = this.columns();

    if (typeof cols === 'number') {
      return `--columns: ${cols}`;
    }

    return [
      `--columns: ${cols.default}`,
      cols.md ? `--columns-md: ${cols.md}` : '',
      cols.sm ? `--columns-sm: ${cols.sm}` : '',
    ]
      .filter(Boolean)
      .join('; ');
  });

  protected calculateReorderedItems<T extends { id: string }>(
    items: T[],
    dragId: string,
    dropId: string,
  ): T[] {
    const dragIndex = items.findIndex((item) => item.id === dragId);
    const dropIndex = items.findIndex((item) => item.id === dropId);

    if (dragIndex === -1 || dropIndex === -1 || dragIndex === dropIndex) {
      return items;
    }

    const newItems = [...items];
    const [movedItem] = newItems.splice(dragIndex, 1);

    const targetIndex = newItems.findIndex((item) => item.id === dropId);
    const insertionIndex =
      dragIndex < dropIndex ? targetIndex + 1 : targetIndex;

    newItems.splice(insertionIndex, 0, movedItem);
    return newItems;
  }

  protected onDragStart(id: string, event: PointerEvent): void {
    this.draggingId.set(id);
    this.startX = event.clientX;
    this.startY = event.clientY;

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  protected onPointerMove = (event: PointerEvent): void => {
    this.currentX.set(event.clientX - this.startX);
    this.currentY.set(event.clientY - this.startY);

    const draggedElement = this.containerRef.nativeElement.querySelector(
      `[data-card-id="${this.draggingId()}"]`,
    ) as HTMLElement | null;

    if (draggedElement) {
      draggedElement.style.pointerEvents = 'none';
    }

    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY,
    );
    const cardBelow = elementBelow?.closest('[data-card-id]');
    const isCardWithinContainer =
      cardBelow && this.containerRef.nativeElement.contains(cardBelow);

    const boardBelow = elementBelow?.closest('[data-board-id]');
    const isBoardWithinContainer =
      boardBelow && this.containerRef.nativeElement.contains(boardBelow);

    let targetId: string | null = null;

    if (isCardWithinContainer) {
      targetId = cardBelow.getAttribute('data-card-id');
    } else if (isBoardWithinContainer) {
      targetId = `board:${boardBelow.getAttribute('data-board-id')}`;
    }

    if (draggedElement) {
      draggedElement.style.pointerEvents = '';
    }

    if (targetId !== this.draggingId()) {
      this.dropTargetId.set(targetId);
    } else {
      this.dropTargetId.set(null);
    }
  };

  protected onPointerUp = (): void => {
    const dragId = this.draggingId();
    const dropId = this.dropTargetId();

    if (dragId && dropId && dragId !== dropId) {
      this.handleDrop(dragId, dropId);
    }

    this.resetDragState();
    this.removeListeners();
  };

  protected abstract handleDrop(dragId: string, dropId: string): void;

  protected resetDragState(): void {
    this.draggingId.set(null);
    this.dropTargetId.set(null);
    this.currentX.set(0);
    this.currentY.set(0);
  }

  protected removeListeners(): void {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  public ngOnDestroy(): void {
    this.removeListeners();
  }
}
