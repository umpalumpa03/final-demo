import { Component, input, signal } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TotalAmount } from '../total-amount-distribute/total-amount';

@Component({
  selector: 'app-payment-distribution',
  imports: [ButtonComponent, TotalAmount],
  templateUrl: './payment-distribution.html',
  styleUrl: './payment-distribution.scss',
})
export class PaymentDistribution {
  public distributionMode = signal<'individual' | 'equal'>('individual');
  public selectedItemsLength = input<number>();

  public onDistributionChange(mode: 'individual' | 'equal'): void {
    this.distributionMode.set(mode);
  }
}
