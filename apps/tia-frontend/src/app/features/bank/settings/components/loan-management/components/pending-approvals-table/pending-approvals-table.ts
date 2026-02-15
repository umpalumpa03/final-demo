import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PendingApproval } from '../../shared/models/loan-management.model';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { Avatar } from '@tia/shared/lib/data-display/avatars/avatar';
import { LoanBadge } from '../../shared/ui/loan-badge/loan-badge';

@Component({
  selector: 'app-pending-approvals-table',
  imports: [CommonModule, TranslatePipe, ErrorStates, BasicCard, Avatar, LoanBadge, CurrencyPipe, DatePipe],
  templateUrl: './pending-approvals-table.html',
  styleUrl: './pending-approvals-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingApprovalsTable {
  public readonly approvals = input.required<PendingApproval[]>();
  public readonly error = input<string | null>(null);

  public readonly rowClick = output<string>();
  public readonly reload = output<void>();

  public readonly hasApprovals = computed(() => this.approvals().length > 0);
  public readonly showEmptyState = computed(
    () => !this.error() && !this.hasApprovals(),
  );
  public readonly showError = computed(
    () => !!this.error(),
  );
  public readonly showList = computed(
    () => !this.error() && this.hasApprovals(),
  );

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
