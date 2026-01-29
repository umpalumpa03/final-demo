import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Account,
  AccountType,
} from '../../../../../../../../shared/models/accounts/accounts.model';
import { AccountCardViewComponent } from '../components/account-card-view/account-card-view';
import { FormatUtils } from '../../../utils/format-date.utils';
import { AccountUtils } from '../../../utils/account.utils';

@Component({
  selector: 'app-account-card',
  imports: [CommonModule, AccountCardViewComponent],
  templateUrl: './account-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  public account = input.required<Account>();
  public transfer = output<string>();
  public rename = output<string>();

  private readonly formatUtils = new FormatUtils();
  private readonly accountUtils = new AccountUtils();

  protected accountIcon = computed(() =>
    this.accountUtils.getAccountIcon(this.account().type),
  );
  protected formattedBalance = computed(() =>
    this.formatUtils.formatCurrency(this.account().balance),
  );
  protected formattedDate = computed(() =>
    this.formatUtils.formatDate(this.account().createdAt),
  );

  public handleTransfer(): void {
    this.transfer.emit(this.account().id);
  }

  public handleRename(): void {
    this.rename.emit(this.account().id);
  }

  public formatCurrency(amount: number): string {
    return this.formatUtils.formatCurrency(amount);
  }

  public getAccountIcon(accountType: AccountType): string {
    return this.accountUtils.getAccountIcon(accountType);
  }
}
