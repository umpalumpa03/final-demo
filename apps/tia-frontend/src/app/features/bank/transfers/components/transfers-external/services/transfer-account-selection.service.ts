import { inject, Injectable, Signal, effect, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TransferStore } from '../../../store/transfers.store';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { RecipientAccount } from '../../../models/transfers.state.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { TransferUtilsService } from '../../../services/transfer-utils.service';

@Injectable()
export class TransferAccountSelectionService {
  private readonly router = inject(Router);
  private readonly transferStore = inject(TransferStore);
  private readonly store = inject(Store);
  private readonly utilsService = inject(TransferUtilsService);

  public initAutoSelectionLogic(
    senderAccounts: Signal<Account[]>,
    recipientAccounts: Signal<RecipientAccount[]>,
    isExternal: Signal<boolean>,
    preSelectedAccount: Signal<Account | null | undefined>,
    onCurrencyMismatch: () => void,
  ): void {
    effect(() => {
      const preSelected = preSelectedAccount();
      const currentSender = this.transferStore.senderAccount();
      const recipientAccount = this.transferStore.selectedRecipientAccount();
      const isExt = isExternal();

      if (!preSelected || currentSender) return;

      untracked(() => {
        const isValid = this.utilsService.isSenderAccountValid(
          preSelected,
          recipientAccount,
          isExt,
        );

        if (!isValid) {
          if (
            !isExt &&
            recipientAccount &&
            preSelected.currency !== recipientAccount.currency
          ) {
            onCurrencyMismatch();
          }

          // Clear the pre-selection from the global store since it's invalid for this context
          this.store.dispatch(AccountsActions.selectAccount({ account: null }));
          return;
        }

        // It's valid! Set it as the sender
        this.transferStore.setSenderAccount(preSelected);

        // Clear the global "pre-selection" so it doesn't try to re-apply on subsequent changes
        this.store.dispatch(AccountsActions.selectAccount({ account: null }));
      });
    });

    // Effect 2: Handle Favorite Auto-selection
    effect(() => {
      const sAccounts = senderAccounts();
      const rAccounts = recipientAccounts();
      const currentSender = this.transferStore.senderAccount();
      const currentRecipient = this.transferStore.selectedRecipientAccount();
      const isExt = isExternal();

      untracked(() => {
        if (!isExt && rAccounts.length > 0 && !currentRecipient) {
          const firstRecipient = rAccounts[0];
          if ((firstRecipient as Account).isFavorite) {
            this.transferStore.setSelectedRecipientAccount(firstRecipient);
          }
        }
        if (sAccounts.length > 0 && !currentSender) {
          const firstSender = sAccounts[0];
          const updatedRecipient =
            this.transferStore.selectedRecipientAccount();

          const isFav = firstSender.isFavorite;
          const isValid = this.utilsService.isSenderAccountValid(
            firstSender,
            updatedRecipient,
            isExt,
          );

          if (isFav && isValid) {
            this.transferStore.setSenderAccount(firstSender);
          }
        }
      });
    });
  }

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
      this.transferStore.setHasShownAmountToast(false);
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
      this.transferStore.setHasShownAmountToast(false);
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
