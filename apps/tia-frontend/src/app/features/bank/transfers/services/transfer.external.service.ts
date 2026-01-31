import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, skip, take, tap } from 'rxjs';
import { TransferStore } from '../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountData, RecipientAccount } from '../models/transfers.state.model';

@Injectable()
export class TransferExternalService {
  private readonly router = inject(Router);
  private readonly transferStore = inject(TransferStore);
  private readonly validationService = inject(TransferValidationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly recipientInfo$ = toObservable(
    this.transferStore.recipientInfo,
  );

  public verifyRecipient(value: string): void {
    const storedValue = this.transferStore.recipientInput();
    const storedType = this.transferStore.recipientType();
    const hasExistingData = this.transferStore.recipientInfo();
    const currentType = this.validationService.identifyRecipientType(value);

    // skip api call if value and type match existing data
    if (
      value === storedValue &&
      currentType === storedType &&
      hasExistingData
    ) {
      this.router.navigate(['/bank/transfers/external/accounts']);
      return;
    }

    if (currentType) {
      // external bank iban, no api call, save locally and navigate
      if (currentType === 'iban-different-bank') {
        this.transferStore.setExternalRecipient(value, currentType);
        this.router.navigate(['/bank/transfers/external/accounts']);
        return;
      }

      // phone or same bank iban, call api to lookup recipient
      this.transferStore.lookupRecipient({
        value,
        type: currentType,
      });

      // wait for new api response and navigate
      this.recipientInfo$
        .pipe(
          skip(1),
          filter((info) => !!info),
          take(1),
          tap(() =>
            this.router.navigate(['/bank/transfers/external/accounts']),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  public isRecipientAccountDisabled(
    account: RecipientAccount,
    selectedSenderAccount: Account | null,
  ): boolean {
    const senderCurrency = selectedSenderAccount?.currency;
    // disable if sender is selected and currencies don't match
    return senderCurrency ? account.currency !== senderCurrency : false;
  }

  public isSenderAccountDisabled(
    account: Account,
    selectedRecipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): boolean {
    // external iban no filtering
    if (isExternalIban) return false;

    const recipientCurrency = selectedRecipientAccount?.currency;
    // disable if recipient is selected and currencies don't match
    return recipientCurrency ? account.currency !== recipientCurrency : false;
  }

  public handleRecipientAccountSelect(
    account: RecipientAccount,
    currentSelected: RecipientAccount | null,
  ): void {
    // toggle if clicking same account, deselect it
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
    // toggle if clicking same account, deselect it
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
    if (selectedRecipientAccount || isExternalIban) {
      if (isExternalIban && recipientName) {
        this.transferStore.setManualRecipientName(recipientName);
      }

      this.router.navigate(['/bank/transfers/external/amount']);
    }
  }
}