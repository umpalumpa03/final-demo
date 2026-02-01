import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-quick-actions-section',
  templateUrl: './quick-actions-section.html',
  styleUrls: ['./quick-actions-section.scss'],
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsSection {
  readonly transferOwnClicked = output<void>();
  readonly transferExternalClicked = output<void>();
  readonly paybillClicked = output<void>();
  readonly viewTransactionsClicked = output<void>();

  protected handleTransferOwn(): void {
    this.transferOwnClicked.emit();
  }

  protected handleTransferExternal(): void {
    this.transferExternalClicked.emit();
  }

  protected handlePaybill(): void {
    this.paybillClicked.emit();
  }

  protected handleViewTransactions(): void {
    this.viewTransactionsClicked.emit();
  }
}