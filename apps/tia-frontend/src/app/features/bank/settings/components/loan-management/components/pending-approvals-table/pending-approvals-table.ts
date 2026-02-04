import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PendingApproval } from '../../shared/models/loan-management.model';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { LOAN_ICONS } from '../../../../../loans/shared/config/loan-icons.config';

/**
 * Pending approvals list component.
 * Displays list of loans awaiting approval.
 * Uses existing library components: Avatar, Badges, BasicCard.
 */
@Component({
  selector: 'app-pending-approvals-table',
  imports: [CommonModule, Spinner, ErrorStates, BasicCard, Avatar, Badges, CurrencyPipe, DatePipe],
  templateUrl: './pending-approvals-table.html',
  styleUrl: './pending-approvals-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingApprovalsTable {
  // Inputs
  public readonly approvals = input.required<PendingApproval[]>();
  public readonly isLoading = input<boolean>(false);
  public readonly error = input<string | null>(null);

  // Outputs
  public readonly rowClick = output<string>();
  public readonly reload = output<void>();

  // Loan icon for pending status
  public readonly pendingIcon = LOAN_ICONS.pending;

  // Computed
  public readonly hasApprovals = computed(() => this.approvals().length > 0);
  public readonly showEmptyState = computed(
    () => !this.isLoading() && !this.error() && !this.hasApprovals(),
  );
  public readonly showError = computed(
    () => !this.isLoading() && !!this.error(),
  );
  public readonly showList = computed(
    () => !this.isLoading() && !this.error() && this.hasApprovals(),
  );

  /**
   * Get initials from full name for Avatar component
   */
  public getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  public onRowClick(id: string): void {
    this.rowClick.emit(id);
  }

  public onReload(): void {
    this.reload.emit();
  }
}
