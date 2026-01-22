import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DraggableItemType } from '../../model/drag.model';

@Component({
  selector: 'app-draggable-card',
  imports: [],
  templateUrl: './draggable-card.html',
  styleUrl: './draggable-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraggableCard {
  public itemData = input.required<DraggableItemType>();
  public isDragging = input(false);
  public isDropTarget = input(false);

  public dragStart = output<PointerEvent>();
  public remove = output<void>();

  public onDragStartPoint(event: PointerEvent): void {
    event.preventDefault();
    this.dragStart.emit(event);
  }

  public onRemove(): void {
    this.remove.emit();
  }
}
