import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreditScoreBadge,
  LoanDetailsResponse,
  PendingApproval,
  UserInfo,
} from '../../shared/models/loan-management.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { BadgeCustomColor } from '@tia/shared/lib/primitives/badges/models/badges.models';
import { useLoanDrawerConfig } from '../../shared/config/loan-drawer.config';

@Component({
  selector: 'app-loan-case-drawer',
  imports: [
    ButtonComponent,
    Skeleton,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    Badges,
  ],
  templateUrl: './loan-case-drawer.html',
  styleUrl: './loan-case-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanCaseDrawer {
  protected readonly labels = toSignal(useLoanDrawerConfig(), {
    initialValue: {
      title: '', subtitle: '', applicantSection: '', loanSection: '',
      riskSection: '', declineSection: '', fullName: '', email: '',
      phoneNumber: '', employmentStatus: '', address: '', annualIncome: '',
      creditScore: '', applicantUnavailable: '', loanAmount: '', loanPurpose: '',
      loanTerm: '', interestRate: '', monthlyPayment: '', requestDate: '',
      months: '', debtToIncome: '', loanToIncome: '', totalInterest: '',
      declinePlaceholder: '', close: '', decline: '', approve: '', cancel: '',
      confirmDecline: '',
    },
  });

  public readonly isOpen = input.required<boolean>();
  public readonly loanDetails = input<PendingApproval | null>(null);
  public readonly loanDetailsResponse = input<LoanDetailsResponse | null>(null);
  public readonly userInfo = input<UserInfo | null>(null);
  public readonly isUserInfoLoading = input<boolean>(false);
  public readonly isLoanDetailsLoading = input<boolean>(false);
  public readonly isActionLoading = input<boolean>(false);

  public readonly closed = output<void>();
  public readonly approve = output<string>();
  public readonly reject = output<{ loanId: string; reason: string }>();

  public readonly showDeclineForm = signal<boolean>(false);
  public readonly declineReason = signal<string>('');

  constructor() {
    effect(() => {
      const details = this.loanDetails();
      const isOpen = this.isOpen();

      if (!isOpen || details) {
        this.showDeclineForm.set(false);
        this.declineReason.set('');
      }
    });
  }

  public readonly canApprove = computed(
    () =>
      !!this.loanDetails() &&
      !this.isActionLoading() &&
      !this.showDeclineForm(),
  );

  public readonly canDecline = computed(
    () =>
      !!this.loanDetails() &&
      !this.isActionLoading() &&
      this.showDeclineForm() &&
      this.declineReason().trim().length > 0,
  );

  public readonly creditScoreBadgeColor = computed((): BadgeCustomColor => {
    const badge = this.userInfo()?.creditScoreBadge;
    if (!badge) return 'slate';
    const colorMap: Record<CreditScoreBadge, BadgeCustomColor> = {
      Poor: 'rose',
      Fair: 'amber',
      Good: 'teal',
      'Very Good': 'cyan',
      Excellent: 'lime',
    };
    return colorMap[badge] || 'slate';
  });

  public readonly interestRate = computed(() => {
    return this.loanDetailsResponse()?.loanDetails.interestRate ?? 0;
  });

  public readonly monthlyPayment = computed(() => {
    return this.loanDetailsResponse()?.loanDetails.monthlyPayment ?? 0;
  });

  public readonly totalInterest = computed(() => {
    return this.loanDetailsResponse()?.riskAssessment.totalInterest ?? 0;
  });

  public readonly debtToIncomeRatio = computed(() => {
    return this.loanDetailsResponse()?.riskAssessment.debtToIncomeRatio ?? 0;
  });

  public readonly loanToIncomeRatio = computed(() => {
    return this.loanDetailsResponse()?.riskAssessment.loanToIncomeRatio ?? 0;
  });

  public onClose(): void {
    this.showDeclineForm.set(false);
    this.declineReason.set('');
    this.closed.emit();
  }

  public onApprove(): void {
    const loanId = this.loanDetails()?.id;
    if (loanId) {
      this.approve.emit(loanId);
    }
  }

  public onShowDeclineForm(): void {
    this.showDeclineForm.set(true);
  }

  public onCancelDecline(): void {
    this.showDeclineForm.set(false);
    this.declineReason.set('');
  }

  public onConfirmDecline(): void {
    const loanId = this.loanDetails()?.id;
    const reason = this.declineReason().trim();
    if (loanId && reason) {
      this.reject.emit({ loanId, reason });
    }
  }

  public onReasonChange(value: string): void {
    this.declineReason.set(value);
  }
}
