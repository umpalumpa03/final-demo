import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DraggableCard } from 'apps/tia-frontend/src/app/shared/lib/drag-n-drop/draggable-card/draggableCard';
import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { items } from '../../config/draggable-data';

@Component({
  selector: 'app-drag-card',
  imports: [DraggableCard],
  templateUrl: './drag-card.html',
  styleUrl: './drag-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragCard {
  items: DraggableItemType[] = [...items];

  draggingIndex = signal<number | null>(null);
  startX = 0;
  startY = 0;
  currentX = signal(0);
  currentY = signal(0);

  public onDragStart(index: number, event: PointerEvent): void {
    this.draggingIndex.set(index);
    this.startX = event.clientX;
    this.startY = event.clientY;

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  public onPointerMove = (event: PointerEvent): void => {
    this.currentX.set(event.clientX - this.startX);
    this.currentY.set(event.clientY - this.startY);
  };

  public onPointerUp = (): void => {
    this.draggingIndex.set(null);
    this.currentX.set(0);
    this.currentY.set(0);

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  public onRemove(index: number): void {
    this.items.splice(index, 1);
  }
}
