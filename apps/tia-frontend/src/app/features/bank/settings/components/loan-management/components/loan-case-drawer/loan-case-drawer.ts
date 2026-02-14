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
import {
  LoanDetailsResponse,
  PendingApproval,
  UserInfo,
} from '../../shared/models/loan-management.model';
import { useLoanDrawerConfig } from '../../shared/config/loan-drawer.config';
import { LoanDrawerApplicant } from './components/loan-drawer-applicant/loan-drawer-applicant';
import { LoanDrawerLoanDetails } from './components/loan-drawer-loan-details/loan-drawer-loan-details';
import { LoanDrawerRiskAssessment } from './components/loan-drawer-risk-assessment/loan-drawer-risk-assessment';
import { LoanDrawerDeclineForm } from './components/loan-drawer-decline-form/loan-drawer-decline-form';
import { LoanDrawerFooter } from './components/loan-drawer-footer/loan-drawer-footer';

@Component({
  selector: 'app-loan-case-drawer',
  imports: [
    LoanDrawerApplicant,
    LoanDrawerLoanDetails,
    LoanDrawerRiskAssessment,
    LoanDrawerDeclineForm,
    LoanDrawerFooter,
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
      creditScorePoor: '', creditScoreFair: '', creditScoreGood: '',
      creditScoreVeryGood: '', creditScoreExcellent: '',
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

  public onReasonInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.declineReason.set(target.value);
  }
}
