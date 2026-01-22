import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { Tables } from '@tia/shared/lib/data-display/components/tables';
import { TableConfig } from '@tia/shared/lib/data-display/models/table.model';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';

@Component({
  selector: 'app-tables-layout',
  imports: [LibraryTitle, Tables, ShowcaseCard],
  templateUrl: './tables-layout.html',
  styleUrl: './tables-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesLayout {
  public tableConfig: TableConfig = {
    type: 'basic',
    paginationType: 'scroll',
    headers: [
      { title: 'Invoice', align: 'left', width: '10rem' },
      { title: 'Status', align: 'left', width: '27rem' },
      { title: 'Method', align: 'left', width: '40rem' },
      { title: 'Amount', align: 'right', width: '27rem' },
    ],
    rows: [
      [
        { type: 'text', value: 'INV001', align: 'left' },
        { type: 'text', value: 'Paid', align: 'left' },
        { type: 'text', value: 'Credit Card', align: 'left' },
        { type: 'text', value: '$250.00', align: 'right' },
      ],
      [
        { type: 'text', value: 'INV002', align: 'left' },
        { type: 'text', value: 'Pending', align: 'left' },
        { type: 'text', value: 'PayPal', align: 'left' },
        { type: 'text', value: '$150.00', align: 'right' },
      ],
      [
        { type: 'text', value: 'INV003', align: 'left' },
        { type: 'text', value: 'Unpaid', align: 'left' },
        { type: 'text', value: 'Bank Transfer', align: 'left' },
        { type: 'text', value: '$350.00', align: 'right' },
      ],
    ],
  };
}
