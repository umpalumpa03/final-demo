import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TablesLayout } from '../components/tables-layout';

@Component({
  selector: 'app-tables-container',
  imports: [TablesLayout],
  templateUrl: './tables-container.html',
  styleUrl: './tables-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesContainer {}
