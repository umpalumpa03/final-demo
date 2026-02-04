import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreditScoreBadge,
  PendingApproval,
  UserInfo,
} from '../../shared/models/loan-management.model';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { BadgeCustomColor } from '@tia/shared/lib/primitives/badges/models/badges.models';
@Component({
  selector: 'app-loan-case-drawer',
  imports: [
    UiModal,
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
  private readonly DEFAULT_INTEREST_RATE = 5.5;
  public readonly isOpen = input.required<boolean>();
  public readonly loanDetails = input<PendingApproval | null>(null);
  public readonly userInfo = input<UserInfo | null>(null);
  public readonly isUserInfoLoading = input<boolean>(false);
  public readonly isActionLoading = input<boolean>(false);
  public readonly actionError = input<string | null>(null);

  public readonly closed = output<void>();
  public readonly approve = output<string>();
  public readonly reject = output<{ loanId: string; reason: string }>();

  public readonly showDeclineForm = signal<boolean>(false);
  public readonly declineReason = signal<string>('');

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
      Excellent: 'lime',
    };
    return colorMap[badge] || 'slate';
  });

  public readonly interestRate = computed(() => {
    return `${this.DEFAULT_INTEREST_RATE}%`;
  });

  public readonly monthlyPayment = computed(() => {
    const loan = this.loanDetails();
    if (!loan) return 0;

    const principal = loan.loanAmount;
    const months = loan.months;
    const annualRate = this.DEFAULT_INTEREST_RATE / 100;
    const monthlyRate = annualRate / 12;

    if (monthlyRate === 0) {
      return principal / months;
    }

    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(payment);
  });

  public readonly totalInterest = computed(() => {
    const loan = this.loanDetails();
    if (!loan) return 0;

    const totalPayments = this.monthlyPayment() * loan.months;
    return Math.round(totalPayments - loan.loanAmount);
  });

  public readonly debtToIncomeRatio = computed(() => {
    const user = this.userInfo();
    if (!user || !user.annualIncome) return 0;

    const monthlyIncome = user.annualIncome / 12;
    const ratio = (this.monthlyPayment() / monthlyIncome) * 100;
    return ratio.toFixed(1);
  });

  public readonly loanToIncomeRatio = computed(() => {
    const loan = this.loanDetails();
    const user = this.userInfo();
    if (!loan || !user || !user.annualIncome) return 0;

    const ratio = (loan.loanAmount / user.annualIncome) * 100;
    return ratio.toFixed(1);
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
