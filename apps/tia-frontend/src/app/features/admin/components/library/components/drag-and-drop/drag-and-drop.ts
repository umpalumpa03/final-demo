import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DragCard } from './components/drag-card/drag-card';
@Component({
  selector: 'app-drag-and-drop-container',
  imports: [DragCard],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropContainer {}
