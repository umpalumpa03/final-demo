import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  CreditScoreBadge,
  UserInfo,
} from '../../../../shared/models/loan-management.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { LoanBadge, LoanBadgeVariant } from '../../../../shared/ui/loan-badge/loan-badge';

export interface ApplicantLabels {
  applicantSection: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  employmentStatus: string;
  address: string;
  annualIncome: string;
  creditScore: string;
  applicantUnavailable: string;
  creditScorePoor: string;
  creditScoreFair: string;
  creditScoreGood: string;
  creditScoreVeryGood: string;
  creditScoreExcellent: string;
}

@Component({
  selector: 'app-loan-drawer-applicant',
  imports: [CurrencyPipe, Skeleton, LoanBadge],
  templateUrl: './loan-drawer-applicant.html',
  styleUrl: './loan-drawer-applicant.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDrawerApplicant {
  public readonly userInfo = input<UserInfo | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly labels = input.required<ApplicantLabels>();

  public readonly creditScoreBadgeVariant = computed((): LoanBadgeVariant => {
    const badge = this.userInfo()?.creditScoreBadge;
    if (!badge) return 'pending';
    const variantMap: Record<CreditScoreBadge, LoanBadgeVariant> = {
      Poor: 'poor',
      Fair: 'fair',
      Good: 'good',
      'Very Good': 'very-good',
      Excellent: 'excellent',
    };
    return variantMap[badge] || 'pending';
  });

  public readonly creditScoreBadgeText = computed((): string => {
    const badge = this.userInfo()?.creditScoreBadge;
    if (!badge) return '';
    const l = this.labels();
    const textMap: Record<CreditScoreBadge, string> = {
      Poor: l.creditScorePoor,
      Fair: l.creditScoreFair,
      Good: l.creditScoreGood,
      'Very Good': l.creditScoreVeryGood,
      Excellent: l.creditScoreExcellent,
    };
    return textMap[badge] || badge;
  });
}
