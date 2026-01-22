import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableConfig } from '../models/table.model';

@Component({
  selector: 'app-tables',
  imports: [],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tables {
  public tableConfig = input.required<TableConfig>();
}
