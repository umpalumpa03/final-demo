import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, skip, take, tap } from 'rxjs';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { TransferStore } from '../../../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import {
  RecipientAccount,
  RecipientType,
} from '../../../models/transfers.state.model';

@Injectable()
export class TransferRecipientService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
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
      this.transferStore.lookupRecipient({ value, type: currentType });

      // wait for new api response and navigate
      this.recipientInfo$
        .pipe(
          skip(1),
          filter((info) => !!info),
          take(1),
          tap((info) => {
            // auto-select single account
            const accounts = info?.accounts || [];
            if (accounts.length === 1) {
              this.transferStore.setSelectedRecipientAccount(accounts[0]);
            }

            this.router.navigate(['/bank/transfers/external/accounts']);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  public handleRetryRecipientLookup(
    value: string | null,
    type: RecipientType | null,
  ): void {
    if (value && type) {
      this.transferStore.lookupRecipient({ value, type });
    } else {
      this.location.back();
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
}
