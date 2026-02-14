import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTotalAmount } from '../../../../store/paybill.selectors';
import { CurrencyPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-total-amount',
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './total-amount.html',
  styleUrl: './total-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalAmount {
  private readonly store = inject(Store);
  public totalAmount = this.store.selectSignal(selectTotalAmount);
}
