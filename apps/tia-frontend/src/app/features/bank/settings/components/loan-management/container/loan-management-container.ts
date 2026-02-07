import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { LoanManagementStore } from '../store/loan-management.store';
import { PendingApprovalsTable } from '../components/pending-approvals-table/pending-approvals-table';
import { LoanCaseDrawer } from '../components/loan-case-drawer/loan-case-drawer';
import { useLoanManagementConfig } from '../shared/config/loan-management.config';

@Component({
  selector: 'app-loan-management-container',
  imports: [BasicCard, PendingApprovalsTable, LoanCaseDrawer, DismissibleAlerts],
  templateUrl: './loan-management-container.html',
  styleUrl: './loan-management-container.scss',
  providers: [LoanManagementStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanManagementContainer implements OnInit {
  protected readonly store = inject(LoanManagementStore);

  protected readonly config = toSignal(useLoanManagementConfig(), {
    initialValue: { title: '', subtitle: '' },
  });

  constructor() {
    effect(() => {
      const message = this.store.successMessage();
      if (message) {
        setTimeout(() => this.store.clearSuccessMessage(), 4000);
      }
    });
    effect(() => {
      const error = this.store.actionError();
      if (error) {
        setTimeout(() => this.store.clearError(), 4000);
      }
    });
  }

  public ngOnInit(): void {
    this.store.loadPendingApprovals();
  }

  protected onRowClick(loanId: string): void {
    this.store.selectLoan(loanId);
  }

  protected onReload(): void {
    this.store.loadPendingApprovals();
  }
  
  protected onDrawerClose(): void {
    this.store.clearSelection();
  }

  protected onApprove(loanId: string): void {
    this.store.approveLoan(loanId);
  }

  protected onReject(event: { loanId: string; reason: string }): void {
    this.store.rejectLoan(event);
  }
}
