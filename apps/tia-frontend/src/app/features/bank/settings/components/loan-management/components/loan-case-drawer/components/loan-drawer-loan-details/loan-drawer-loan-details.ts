import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  LoanDetailsResponse,
  PendingApproval,
} from '../../../../shared/models/loan-management.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

export interface LoanDetailsLabels {
  loanSection: string;
  loanAmount: string;
  loanPurpose: string;
  loanTerm: string;
  interestRate: string;
  monthlyPayment: string;
  requestDate: string;
  months: string;
}

@Component({
  selector: 'app-loan-drawer-loan-details',
  imports: [CurrencyPipe, DatePipe, Skeleton],
  templateUrl: './loan-drawer-loan-details.html',
  styleUrl: './loan-drawer-loan-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDrawerLoanDetails {
  public readonly loanDetails = input<PendingApproval | null>(null);
  public readonly loanDetailsResponse = input<LoanDetailsResponse | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly labels = input.required<LoanDetailsLabels>();

  public readonly interestRate = computed(() => {
    return this.loanDetailsResponse()?.loanDetails.interestRate ?? 0;
  });

  public readonly monthlyPayment = computed(() => {
    return this.loanDetailsResponse()?.loanDetails.monthlyPayment ?? 0;
  });
}
