import { Injectable } from '@angular/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { RecipientAccount } from '../models/transfers.state.model';

export type DisabledReason = 'PERMISSION_DENIED' | 'CURRENCY_MISMATCH' | null;

@Injectable({ providedIn: 'root' })
export class TransferUtilsService {
  private readonly PERMISSION_EXTERNAL_GEL = 2;
  private readonly PERMISSION_EXTERNAL_FOREIGN = 4;

  public isSenderAccountValid(
    account: Account,
    recipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): boolean {
    return (
      this.getDisabledReason(account, recipientAccount, isExternalIban) === null
    );
  }

  public isSenderAccountDisabled(
    account: Account,
    recipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): boolean {
    return (
      this.getDisabledReason(account, recipientAccount, isExternalIban) !== null
    );
  }

  public getDisabledReason(
    account: Account,
    recipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): DisabledReason {
    const { permission, currency } = account;

    const hasGelExternal = !!(permission & this.PERMISSION_EXTERNAL_GEL);
    const hasForeignExternal = !!(
      permission & this.PERMISSION_EXTERNAL_FOREIGN
    );

    if (currency === 'GEL') {
      if (!hasGelExternal) return 'PERMISSION_DENIED';
    } else {
      if (!hasForeignExternal) return 'PERMISSION_DENIED';
    }

    if (!isExternalIban && recipientAccount) {
      if (account.currency !== recipientAccount.currency) {
        return 'CURRENCY_MISMATCH';
      }
    }

    return null;
  }

  public isRecipientAccountDisabled(
    recipientAccount: RecipientAccount,
    senderAccount: Account | null,
  ): boolean {
    if (!senderAccount) return false;
    return recipientAccount.currency !== senderAccount.currency;
  }
}
