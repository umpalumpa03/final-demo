import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SummaryField } from '../../../../shared/models/summary.model';

@Component({
  selector: 'app-payment-summary',
  imports: [],
  templateUrl: './payment-summary.html',
  styleUrl: './payment-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSummary {
  public readonly headerTitle = input.required<string>();
  public readonly headerSubtitle = input<string>();
  public readonly headerColor = input<string>('var(--color-fg)');
  public readonly backgroundColor = input<string>('#f9fafb');
  public readonly iconUrl = input<string>();

  public readonly items = input.required<SummaryField[]>();
}
