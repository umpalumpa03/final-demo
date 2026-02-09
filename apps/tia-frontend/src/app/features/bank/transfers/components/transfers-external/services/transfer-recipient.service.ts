import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { filter, skip, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { TransferStore } from '../../../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import {
  RecipientAccount,
  RecipientType,
} from '../../../models/transfers.state.model';
import { selectPhoneNumber } from 'apps/tia-frontend/src/app/store/personal-info/personal-info.selectors';
import { DisabledReason } from '../models/transfer.external.model';
import { PersonalInfoActions } from 'apps/tia-frontend/src/app/store/personal-info/pesronal-info.actions';

@Injectable()
export class TransferRecipientService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly validationService = inject(TransferValidationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  private readonly recipientInfo$ = toObservable(
    this.transferStore.recipientInfo,
  );
  private readonly userPhone = toSignal(this.store.select(selectPhoneNumber));

  private isOwnPhoneNumber(value: string): boolean {
    const userPhone = this.userPhone() || '';
    const normalize = (phone: string) =>
      phone.replace(/\D/g, '').replace(/^995/, '');
    return normalize(value) === normalize(userPhone);
  }

  public verifyRecipient(value: string): void {
    const storedValue = this.transferStore.recipientInput();
    const storedType = this.transferStore.recipientType();
    const hasExistingData = this.transferStore.recipientInfo();
    const currentType = this.validationService.identifyRecipientType(value);

    // check if phone matches user's own number
    if (currentType === 'phone' && this.isOwnPhoneNumber(value)) {
      this.transferStore.setError('transfers.external.recipient.ownPhoneError');
      return;
    }

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
            let accounts = info?.accounts || [];
            if (accounts.length === 0 && info?.currency) {
              accounts = [
                {
                  id: 'iban-recipient',
                  iban: value,
                  currency: info.currency,
                },
              ];
              this.transferStore.setSelectedRecipientAccount(accounts[0]);
            } else if (accounts.length === 1) {
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

  public getDisabledReason(
    account: Account,
    selectedRecipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): DisabledReason {
    const { permission, currency } = account;

    if (permission === 2 && currency !== 'GEL') return 'PERMISSION_DENIED';
    if (permission === 4 && currency === 'GEL') return 'PERMISSION_DENIED';
    if (permission !== 2 && permission !== 4) return 'PERMISSION_DENIED';

    if (!isExternalIban && selectedRecipientAccount) {
      if (account.currency !== selectedRecipientAccount.currency) {
        return 'CURRENCY_MISMATCH';
      }
    }

    return null;
  }

  public isSenderAccountDisabled(
    account: Account,
    selectedRecipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): boolean {
    return (
      this.getDisabledReason(
        account,
        selectedRecipientAccount,
        isExternalIban,
      ) !== null
    );
  }
}
