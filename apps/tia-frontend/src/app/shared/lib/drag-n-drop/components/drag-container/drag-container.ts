import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  contentChildren,
  effect,
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DraggableItemType, LayoutType } from '../../model/drag.model';
import { DragBase } from '../../base/base';
import { DraggableCard } from '../draggable-card/draggable-card';
import { DRAG_CONTAINER } from '../../model/drag.provider';

@Component({
  selector: 'app-drag-container',
  imports: [DraggableCard],
  providers: [{ provide: DRAG_CONTAINER, useExisting: DragContainer }],
  templateUrl: './drag-container.html',
  styleUrl: './drag-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragContainer extends DragBase {
  public readonly items = input.required<DraggableItemType[]>();
  public readonly layout = input<LayoutType>('grid');
  public readonly columns = input(2);
  public readonly containerTitle = input('Draggable Cards');
  public readonly containerDescription = input(
    'Drag Cards to reorder them in a grid layout',
  );

  public readonly itemsChange = output<DraggableItemType[]>();
  public readonly orderChange = output<string[]>();

  private readonly cards = contentChildren(DraggableCard);

  constructor() {
    super();
    // onCleanup is used instead of takeUntilDestroyed because we need to unsubscribe when cards() changes, not just on component destroy
    effect((onCleanup) => {
      const allCards = this.cards();

      const subscription = merge(
        ...allCards.map((card) =>
          outputToObservable(card.dragStart).pipe(
            tap((event) => this.onDragStart(card.itemData().id, event)),
          ),
        ),
      ).subscribe();

      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected readonly containerClasses = computed(
    () => `drag-container__cards drag-container__cards--${this.layout()}`,
  );

  protected readonly containerStyles = computed(() =>
    this.layout() === 'grid' ? { '--columns': this.columns() } : null,
  );

  protected override handleDrop(dragId: string, dropId: string): void {
    const currentItems = this.items();
    const dragIndex = currentItems.findIndex((item) => item.id === dragId);
    const dropIndex = currentItems.findIndex((item) => item.id === dropId);

    if (dragIndex === -1 || dropIndex === -1) return;

    const newItems = [...currentItems];

    [newItems[dragIndex], newItems[dropIndex]] = [
      newItems[dropIndex],
      newItems[dragIndex],
    ];

    this.itemsChange.emit(newItems);
    this.orderChange.emit(newItems.map((item) => item.id));
  }
}
