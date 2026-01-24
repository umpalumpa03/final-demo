import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  linkedSignal,
  contentChild,
  TemplateRef,
} from '@angular/core';
import { DraggableItemType, LayoutType } from '../../model/drag.model';
import { DraggableCard } from '../draggable-card/draggable-card';
import { DragBase } from '../../base/base';
import { ButtonVariant } from '@tia/shared/lib/primitives/button/button.model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-drag-card',
  imports: [DraggableCard, NgTemplateOutlet],
  templateUrl: './drag-card.html',
  styleUrl: './drag-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragCard extends DragBase {
  public readonly items = input.required<DraggableItemType[]>();
  public readonly canDelete = input(false);
  public readonly layout = input<LayoutType>('grid');
  public readonly columns = input(2);
  public readonly cardTitle = input('Draggable Cards');
  public readonly cardDescription = input<string>(
    'Drag Cards to reorder them in a grid layout',
  );
  public readonly editable = input(false);
  public readonly hasButton = input(false);
  public readonly buttonVariant = input<ButtonVariant>('ghost');
  public readonly buttonContent = input('Play');
  public readonly hasAddOption = input(false);
  public readonly hasViewOption = input(false);
  public readonly hasPagination = input(false);
  public readonly paginationVariants = input<number[]>([10, 20, 40]);
  public cardContentTemplate = contentChild<TemplateRef<any>>('cardContent');

  public readonly itemsChange = output<DraggableItemType[]>();
  public readonly orderChange = output<string[]>();
  public readonly itemRemoved = output<string>();
  public readonly itemEdited = output<string>();
  public readonly itemAdded = output<string>();
  public readonly viewOptionChanged = output<{
    id: string;
    isViewable: boolean;
  }>();
  public readonly paginationChanged = output<{ id: string; value: number }>();

  public readonly internalItems = linkedSignal<
    DraggableItemType[],
    DraggableItemType[]
  >({
    source: this.items,
    computation: (newItems) => [...newItems],
  });

  protected readonly containerClasses = computed(
    () => `draggable-cards draggable-cards--${this.layout()}`,
  );

  protected readonly containerStyles = computed(() =>
    this.layout() === 'grid' ? `--columns: ${this.columns()}` : null,
  );

  public onDragStartHandler(id: string, event: PointerEvent): void {
    this.onDragStart(id, event);
  }

  protected override handleDrop(dragId: string, dropId: string): void {
    const currentItems = this.internalItems();
    const dragIndex = currentItems.findIndex((item) => item.id === dragId);
    const dropIndex = currentItems.findIndex((item) => item.id === dropId);

    if (dragIndex === -1 || dropIndex === -1) return;

    const newItems = [...currentItems];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);

    this.internalItems.set(newItems);
    this.itemsChange.emit(newItems);
    this.orderChange.emit(newItems.map((item) => item.id));
  }

  public onRemove(id: string): void {
    const updated = this.internalItems().filter((item) => item.id !== id);
    this.internalItems.set(updated);
    this.itemsChange.emit(updated);
    this.itemRemoved.emit(id);
  }

  public onEdit(id: string): void {
    this.itemEdited.emit(id);
  }

  public onAdd(id: string): void {
    this.itemAdded.emit(id);
  }

  public onViewOptionChange(id: string, isViewable: boolean): void {
    this.viewOptionChanged.emit({ id, isViewable });
  }

  public onPaginationChange(id: string, value: number): void {
    this.paginationChanged.emit({ id, value });
  }
}
