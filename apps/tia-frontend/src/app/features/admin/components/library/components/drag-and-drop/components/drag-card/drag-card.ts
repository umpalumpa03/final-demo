import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { DraggableCard } from '@tia/shared/lib/drag-n-drop/draggable-card/draggable-card';
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
  public items: DraggableItemType[] = [...items];

  public draggingId = signal<string | null>(null);
  public startX = 0;
  public startY = 0;
  public currentX = signal(0);
  public currentY = signal(0);

  public draggingStyle = computed(() => ({
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
