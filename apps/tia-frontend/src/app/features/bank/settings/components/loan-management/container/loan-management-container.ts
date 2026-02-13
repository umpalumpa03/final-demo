import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { LoanManagementStore } from '../store/loan-management.store';
import { PendingApprovalsTable } from '../components/pending-approvals-table/pending-approvals-table';
import { LoanCaseDrawer } from '../components/loan-case-drawer/loan-case-drawer';
import { useLoanManagementConfig } from '../shared/config/loan-management.config';

@Component({
  selector: 'app-loan-management-container',
  imports: [BasicCard, PendingApprovalsTable, LoanCaseDrawer],
  templateUrl: './loan-management-container.html',
  styleUrl: './loan-management-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanManagementContainer implements OnInit {
  protected readonly store = inject(LoanManagementStore);
  private readonly alertService = inject(AlertService);

  protected readonly config = toSignal(useLoanManagementConfig(), {
    initialValue: { title: '', subtitle: '' },
  });

  constructor() {
    effect(() => {
      const message = this.store.successMessage();
      if (message) {
        this.alertService.success(message, {
          variant: 'dismissible',
          title: 'Success!',
        });
        this.store.clearSuccessMessage();
      }
    });
    effect(() => {
      const error = this.store.actionError();
      if (error) {
        this.alertService.error(error, {
          variant: 'dismissible',
          title: 'Oops!',
        });
        this.store.clearError();
      }
    });
  }

  public ngOnInit(): void {
    if (this.store.shouldLoadInitialData()) {
      this.store.loadPendingApprovals();
    }
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
