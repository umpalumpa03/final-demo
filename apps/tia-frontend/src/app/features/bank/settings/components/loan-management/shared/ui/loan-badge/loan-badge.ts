import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LoanBadgeVariant =
  | 'pending'
  | 'approved'
  | 'declined'
  | 'poor'
  | 'fair'
  | 'good'
  | 'very-good'
  | 'excellent';

export type LoanBadgeSize = 'small' | 'medium';

@Component({
  selector: 'app-loan-badge',
  templateUrl: './loan-badge.html',
  styleUrl: './loan-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanBadge {
  public readonly text = input.required<string>();
  public readonly variant = input<LoanBadgeVariant>('pending');
  public readonly icon = input<string>('');
  public readonly size = input<LoanBadgeSize>('small');

  public readonly badgeClass = computed(() => {
    const sizeClass = `loan-badge--${this.size()}`;
    const variantClass = `loan-badge--${this.variant()}`;
    return `loan-badge ${sizeClass} ${variantClass}`;
  });
}
