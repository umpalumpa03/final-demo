import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-transactions',
  imports: [],
  templateUrl: './card-transactions.html',
  styleUrl: './card-transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTransactions {}
