import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-payment-summary',
  imports: [],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSummary {
  public readonly serviceName = input.required<string>();
  public readonly accountNumber = input.required<string>();
  public readonly amount = input.required<number>();
}
