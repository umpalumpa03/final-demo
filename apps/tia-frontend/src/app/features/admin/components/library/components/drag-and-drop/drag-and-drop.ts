import { Component } from '@angular/core';
import { DraggableCard } from '../../../../../../shared/lib/drag-n-drop/draggable-card/draggable';
@Component({
  selector: 'app-drag-and-drop-container',
  imports: [DraggableCard],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
})
export class DragAndDropContainer {}
