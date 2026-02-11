import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  LoanDetailsResponse,
  PendingApproval,
} from '../../../../shared/models/loan-management.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

export interface RiskAssessmentLabels {
  riskSection: string;
  debtToIncome: string;
  loanToIncome: string;
  totalInterest: string;
}

@Component({
  selector: 'app-loan-drawer-risk-assessment',
  imports: [CurrencyPipe, Skeleton],
  templateUrl: './loan-drawer-risk-assessment.html',
  styleUrl: './loan-drawer-risk-assessment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDrawerRiskAssessment {
  public readonly loanDetails = input<PendingApproval | null>(null);
  public readonly loanDetailsResponse = input<LoanDetailsResponse | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly labels = input.required<RiskAssessmentLabels>();

  public readonly totalInterest = computed(() => {
    return this.loanDetailsResponse()?.riskAssessment.totalInterest ?? 0;
  });

  public readonly debtToIncomeRatio = computed(() => {
    return this.loanDetailsResponse()?.riskAssessment.debtToIncomeRatio ?? 0;
  });

  public readonly loanToIncomeRatio = computed(() => {
    return this.loanDetailsResponse()?.riskAssessment.loanToIncomeRatio ?? 0;
  });
}
