import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { RecipientAccount } from '../../../models/transfers.state.model';

@Injectable()
export class TransferAccountSelectionService {
  private readonly router = inject(Router);
  private readonly transferStore = inject(TransferStore);

  public handleRecipientAccountSelect(
    account: RecipientAccount,
    currentSelected: RecipientAccount | null,
  ): void {
    if (account.id === 'iban-recipient' && currentSelected?.id === account.id) {
      return;
    }

    if (currentSelected?.id !== account.id) {
      this.transferStore.setAmount(0);
      this.transferStore.setInsufficientBalance(false);
    }

    if (currentSelected?.id === account.id) {
      this.transferStore.setSelectedRecipientAccount(null);
    } else {
      this.transferStore.setSelectedRecipientAccount(account);
    }
  }

  public handleSenderAccountSelect(
    account: Account,
    currentSelected: Account | null,
  ): void {
    if (currentSelected?.id !== account.id) {
      this.transferStore.setAmount(0);
      this.transferStore.setInsufficientBalance(false);
    }

    if (currentSelected?.id === account.id) {
      this.transferStore.setSenderAccount(null);
    } else {
      this.transferStore.setSenderAccount(account);
    }
  }

  public handleContinue(
    selectedRecipientAccount: RecipientAccount | null,
    selectedSenderAccount: Account | null,
    isExternalIban: boolean,
    recipientName: string | null,
  ): void {
    const hasRecipient = !!selectedRecipientAccount;
    const hasSender = !!selectedSenderAccount;

    if ((hasRecipient || isExternalIban) && hasSender) {
      if (isExternalIban && recipientName) {
        this.transferStore.setManualRecipientName(recipientName);
      }

      this.router.navigate(['/bank/transfers/external/amount']);
    }
  }
}
