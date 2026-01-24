import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GridColumns } from './grid-layout.model';
import {
  InitialColsValue,
  InitialGapValue,
} from '../config/grid-layout.config';

@Component({
  selector: 'app-grid-layout',
  imports: [],
  templateUrl: './grid-layout.html',
  styleUrl: './grid-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridLayout {
  public readonly cols = input<GridColumns>(InitialColsValue);
  public readonly gap = input<string>(InitialGapValue);

  public columnsStyle(): string {
    switch (this.cols()) {
      case '2-1':
        return '2fr 1fr';
      case '1-2':
        return '1fr 2fr';
      case '1':
        return 'minmax(0, 1fr)';
      case '2':
        return 'repeat(2, minmax(0, 1fr))';
      case '3':
        return 'repeat(3, minmax(0, 1fr))';
      case '4':
        return 'repeat(4, minmax(0, 1fr))';
      default:
        return 'repeat(1, minmax(0, 1fr))';
    }
  }
}
