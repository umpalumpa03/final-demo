import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { LoanManagementStore } from '../store/loan-management.store';
import { PendingApprovalsTable } from '../components/pending-approvals-table/pending-approvals-table';
import { LoanCaseDrawer } from '../components/loan-case-drawer/loan-case-drawer';

@Component({
  selector: 'app-loan-management-container',
  imports: [BasicCard, PendingApprovalsTable, LoanCaseDrawer],
  templateUrl: './loan-management-container.html',
  styleUrl: './loan-management-container.scss',
  providers: [LoanManagementStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanManagementContainer implements OnInit {
  protected readonly store = inject(LoanManagementStore);

  protected readonly config = {
    title: 'Loan Management',
    subtitle: 'Review and process pending loan applications',
  };

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
