import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { GridColumns } from './grid-layout.model';
import {
  colStyle,
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

  public columnsStyle = computed(() => colStyle[this.cols()]);
}
