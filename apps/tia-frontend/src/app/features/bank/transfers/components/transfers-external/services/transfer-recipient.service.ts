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
import {
  DisabledReason,
  TransferUtilsService,
} from '../../../services/transfer-utils.service';
import { PersonalInfoActions } from 'apps/tia-frontend/src/app/store/personal-info/pesronal-info.actions';

@Injectable()
export class TransferRecipientService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly validationService = inject(TransferValidationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly utilsService = inject(TransferUtilsService);

  private readonly recipientInfo$ = toObservable(
    this.transferStore.recipientInfo,
  );
  private readonly userPhone = toSignal(this.store.select(selectPhoneNumber));

  constructor() {
    if (!this.userPhone()) {
      this.store.dispatch(PersonalInfoActions.loadPersonalInfo({}));
    }
  }

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

    if (currentType === 'phone' && this.isOwnPhoneNumber(value)) {
      this.transferStore.setError('transfers.external.recipient.ownPhoneError');
      return;
    }

    if (
      value === storedValue &&
      currentType === storedType &&
      hasExistingData
    ) {
      this.router.navigate(['/bank/transfers/external/accounts']);
      return;
    }

    if (currentType) {
      if (currentType === 'iban-different-bank') {
        this.transferStore.setExternalRecipient(value, currentType);
        this.router.navigate(['/bank/transfers/external/accounts']);
        return;
      }

      this.transferStore.lookupRecipient({ value, type: currentType });

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
    return this.utilsService.isRecipientAccountDisabled(
      account,
      selectedSenderAccount,
    );
  }

  public getDisabledReason(
    account: Account,
    selectedRecipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): DisabledReason {
    return this.utilsService.getDisabledReason(
      account,
      selectedRecipientAccount,
      isExternalIban,
    );
  }

  public isSenderAccountDisabled(
    account: Account,
    selectedRecipientAccount: RecipientAccount | null,
    isExternalIban: boolean,
  ): boolean {
    return this.utilsService.isSenderAccountDisabled(
      account,
      selectedRecipientAccount,
      isExternalIban,
    );
  }
}
