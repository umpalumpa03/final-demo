import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-widget-transactions',
  imports: [],
  templateUrl: './widget-transactions.html',
  styleUrl: './widget-transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTransactions {}
