import { Directive, inject, computed } from '@angular/core';
import { DraggableCard } from '../components/draggable-card/draggable-card';
import { DRAG_CONTAINER } from '../model/drag.provider';
// Handles drag-related DOM bindings (classes, styles, data attributes) separately from DraggableCard to keep component focused on content only
// Enables drag functionality for DraggableCard when used inside DragContainer with ng-content

@Directive({
  selector: '[appDragItem]',
  host: {
    '[attr.data-card-id]': 'cardId()',
    '[class.is-dragging]': 'isDragging()',
    '[class.is-drop-target]': 'isDropTarget()',
    '[style.transform]': 'draggingTransform()',
    '[style.z-index]': 'draggingZIndex()',
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
}
