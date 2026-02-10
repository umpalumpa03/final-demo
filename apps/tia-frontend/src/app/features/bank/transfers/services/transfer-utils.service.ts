import { Injectable } from '@angular/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { RecipientAccount } from '../models/transfers.state.model';

@Injectable({ providedIn: 'root' })
export class TransferUtilsService {
  public isSenderAccountValid(
    account: Account,
    recipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): boolean {
    const { permission, currency } = account;

    if (permission === 2 && currency !== 'GEL') return false;
    if (permission === 4 && currency === 'GEL') return false;
    if (permission !== 2 && permission !== 4) return false;

    if (!isExternalIban && recipientAccount) {
      if (account.currency !== recipientAccount.currency) {
        return false;
      }
    }

    return true;
  }
}
