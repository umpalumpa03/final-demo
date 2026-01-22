import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  effect,
} from '@angular/core';
import { DraggableItemType } from '../../model/drag.model';
import { DraggableCard } from '../draggable-card/draggable-card';
import { DragBase } from '../../base/base';

@Component({
  selector: 'app-drag-card',
  imports: [DraggableCard],
  templateUrl: './drag-card.html',
  styleUrl: './drag-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragCard extends DragBase {
  public items = input.required<DraggableItemType[]>();
  public canDelete = input<boolean>(false);
  public layout = input<'grid' | 'list'>('grid');
  public columns = input<number>(2);
  public cardTitle = input<string>('Draggable Cards');
  public cardDescription = input<string>(
    'Drag Cards to reorder them in a grid layout',
  );

  public itemsChange = output<DraggableItemType[]>();
  public orderChange = output<string[]>();
  public itemRemoved = output<string>();

  public internalItems: DraggableItemType[] = [];

  protected readonly containerClasses = computed(
    () => `draggable-cards draggable-cards--${this.layout()}`,
  );

  protected readonly containerStyles = computed(() =>
    this.layout() === 'grid' ? `--columns: ${this.columns()}` : null,
  );

  constructor() {
    super();
    effect(() => {
      this.internalItems = [...this.items()];
    });
  }

  public onDragStartHandler(id: string, event: PointerEvent): void {
    this.onDragStart(id, event);
  }

  protected override handleDrop(dragId: string, dropId: string): void {
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
    this.orderChange.emit(this.internalItems.map((item) => item.id));
  }

  public onRemove(id: string): void {
    this.internalItems = this.internalItems.filter((item) => item.id !== id);
    this.itemsChange.emit(this.internalItems);
    this.itemRemoved.emit(id);
  }
}
