import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
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

  draggingId = signal<string | null>(null);
  startX = 0;
  startY = 0;
  currentX = signal(0);
  currentY = signal(0);

  draggingStyle = computed(() => ({
    transform: `translate(${this.currentX()}px, ${this.currentY()}px)`,
    zIndex: 100,
  }));

  public onDragStart(id: string, event: PointerEvent): void {
    this.draggingId.set(id);
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
    this.draggingId.set(null);
    this.currentX.set(0);
    this.currentY.set(0);

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  public onRemove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
