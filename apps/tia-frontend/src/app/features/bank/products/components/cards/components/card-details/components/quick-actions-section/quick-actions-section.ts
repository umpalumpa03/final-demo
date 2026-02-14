import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-quick-actions-section',
  templateUrl: './quick-actions-section.html',
  styleUrls: ['./quick-actions-section.scss'],
  imports: [ButtonComponent,TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsSection {
  readonly viewTransactionsClicked = output<void>();
readonly viewSensitiveDetailsClicked = output<void>();



  protected handleViewTransactions(): void {
    this.viewTransactionsClicked.emit();
  }
  protected handleViewSensitiveDetails(): void {
  this.viewSensitiveDetailsClicked.emit();
}
}