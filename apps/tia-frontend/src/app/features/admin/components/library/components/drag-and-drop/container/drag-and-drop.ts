import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DragCard } from '@tia/shared/lib/drag-n-drop/components/drag-card/drag-card';
import { DraggableItemType } from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { items } from 'apps/tia-frontend/src/app/features/admin/components/library/components/drag-and-drop/config/draggable-data.config';

@Component({
  selector: 'app-drag-and-drop-container',
  imports: [DragCard],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropContainer {
  public items: DraggableItemType[] = [...items];

  public onItemRemoved(id: string): void {}
}
