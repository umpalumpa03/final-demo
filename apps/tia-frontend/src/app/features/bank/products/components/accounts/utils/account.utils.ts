import { Injectable } from '@angular/core';
import { AccountType } from '../../../../../../shared/models/accounts/accounts.model';

@Injectable()
export class AccountUtils {
  private readonly accountIcons = {
    [AccountType.current]: '/images/svg/account/wallet.svg',
    [AccountType.saving]: '/images/svg/account/piggy-bank.svg',
    [AccountType.card]: '/images/svg/account/building.svg',
  };

  public getAccountIcon(type: AccountType): string {
    return this.accountIcons[type] || this.accountIcons[AccountType.current];
  }
}
