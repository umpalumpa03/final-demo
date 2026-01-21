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
  isDragging = input<boolean>(false);

  dragStart = output<PointerEvent>();
  remove = output<void>();

  public onDragStartPoint(event: PointerEvent): void {
    event.preventDefault();
    this.dragStart.emit(event);
  }

  public onRemove(): void {
    this.remove.emit();
  }
}
