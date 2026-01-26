import { Directive, inject, computed } from '@angular/core';
import { DraggableCard } from '../components/draggable-card/draggable-card';
import { DRAG_CONTAINER } from '../model/drag.provider';

@Directive({
  selector: '[appDragItem]',
  host: {
    '[attr.data-card-id]': 'cardId()',
    '[class.is-dragging]': 'isDragging()',
    '[class.is-drop-target]': 'isDropTarget()',
    '[style.transform]': 'draggingTransform()',
    '[style.z-index]': 'draggingZIndex()',
    '[style.grid-column]': 'gridColumn()',
  },
})
export class DragItemDirective {
  private readonly container = inject(DRAG_CONTAINER);
  private readonly card = inject(DraggableCard);

  protected readonly cardId = computed(() => this.card.itemData().id);

  protected readonly isDragging = computed(
    () => this.container.draggingId() === this.cardId(),
  );

  protected readonly isDropTarget = computed(
    () => this.container.dropTargetId() === this.cardId(),
  );

  protected readonly draggingTransform = computed(() =>
    this.isDragging() ? this.container.draggingStyle().transform : null,
  );

  protected readonly draggingZIndex = computed(() =>
    this.isDragging() ? this.container.draggingStyle().zIndex : null,
  );

  protected readonly gridColumn = computed(() =>
    this.container.getColspanForItem(this.cardId()),
  );
}
