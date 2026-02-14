import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Transaction } from '../../../../models/filter.model';
import { TranslatePipe } from "@ngx-translate/core";
import { CommonModule } from '@angular/common';
import {ErrorStates} from '../../../../../../../shared/lib/feedback/error-states/error-states';

@Component({
  selector: 'app-finances-transactions',
  imports: [TranslatePipe,CommonModule,ErrorStates],
  templateUrl: './finances-transactions.html',
  styleUrl: './finances-transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesTransactions {
  public readonly transactions = input<Transaction[]>([]);
}