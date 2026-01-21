import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DraggableItemType } from '../model/drag.model';

@Component({
  selector: 'app-draggable-card',
  imports: [],
  templateUrl: './draggableCard.html',
  styleUrl: './draggableCard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableCard {
  itemData = input<DraggableItemType>();
  index = input.required<number>();
  isDragging = input<boolean>(false);
  dragStart = output<{ index: number; event: PointerEvent }>();
  remove = output<number>();

  public onDragStartPoint(event: PointerEvent): void {
    event.preventDefault();
    this.dragStart.emit({ index: this.index(), event });
  }
  public onRemove(): void {
    this.remove.emit(this.index());
  }
}
