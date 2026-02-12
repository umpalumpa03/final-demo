import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { PendingApproval } from '../../../../shared/models/loan-management.model';

export interface FooterLabels {
  close: string;
  decline: string;
  approve: string;
  cancel: string;
  confirmDecline: string;
}

@Component({
  selector: 'app-loan-drawer-footer',
  imports: [],
  templateUrl: './loan-drawer-footer.html',
  styleUrl: './loan-drawer-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDrawerFooter {
  public readonly showDeclineForm = input<boolean>(false);
  public readonly canApprove = input<boolean>(false);
  public readonly canDecline = input<boolean>(false);
  public readonly isActionLoading = input<boolean>(false);
  public readonly loanDetails = input<PendingApproval | null>(null);
  public readonly labels = input.required<FooterLabels>();

  public readonly close = output<void>();
  public readonly showDecline = output<void>();
  public readonly approve = output<void>();
  public readonly cancelDecline = output<void>();
  public readonly confirmDecline = output<void>();

  public onClose(): void {
    this.close.emit();
  }

  public onShowDecline(): void {
    this.showDecline.emit();
  }

  public onApprove(): void {
    this.approve.emit();
  }

  public onCancelDecline(): void {
    this.cancelDecline.emit();
  }

  public onConfirmDecline(): void {
    this.confirmDecline.emit();
  }
}
