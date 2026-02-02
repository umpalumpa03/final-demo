import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SummaryField, SummaryType } from '../../models/summary.model';

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
  public readonly iconUrl = input<string>();
  public readonly type = input<SummaryType>('otp');
  public readonly items = input.required<SummaryField[]>();
  public readonly iconBgColor = input('');
  public readonly iconBgPath = input('');

  public readonly backgroundColor = computed(() => {
    switch (this.type()) {
      case 'verified':
        return '#f0fdf4';
      case 'confirm-payment':
        return '#eff6ff';
      case 'otp':
      default:
        return '#f9fafb';
    }
  });
}
