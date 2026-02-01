import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { TransferStore } from '../store/transfers.store';
import { TransferValidationService } from './transfer-validation.service';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import {
  RecipientAccount,
  RecipientType,
} from '../models/transfers.state.model';
import { TransfersApiService } from './transfersApi.service';

@Injectable()
export class TransferExternalService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly validationService = inject(TransferValidationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly transfersApi = inject(TransfersApiService);

  private readonly recipientInfo$ = toObservable(
    this.transferStore.recipientInfo,
  );
  private readonly feeUpdateSubject = new Subject<{
    amount: number;
    accountId: string;
  }>();

  constructor() {
    this.setupFeeCalculation();
  }

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
    // reset amount if selecting different account
    if (currentSelected?.id !== account.id) {
      this.transferStore.setAmount(0);
    }

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
    // reset amount if selecting different account
    if (currentSelected?.id !== account.id) {
      this.transferStore.setAmount(0);
    }

    // toggle if clicking same account, deselect it
    if (currentSelected?.id === account.id) {
      this.transferStore.setSenderAccount(null);
    } else {
      this.transferStore.setSenderAccount(account);
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

  public handleAmountGoBack(amount: number, description: string): void {
    this.transferStore.setAmount(amount);
    this.transferStore.setDescription(description);
    this.location.back();
  }

  public handleTransfer(amount: number, description: string): boolean {
    if (amount > 0) {
      this.transferStore.setAmount(amount);
      this.transferStore.setDescription(description);
      return true;
    }
    return false;
  }

  public handleAmountInput(amount: number): void {
    const numericAmount = Number(amount);
    this.transferStore.setAmount(numericAmount);

    const senderAccount = this.transferStore.senderAccount();

    if (numericAmount > 0 && senderAccount?.id) {
      this.transferStore.setLoading(true);

      this.feeUpdateSubject.next({
        amount: numericAmount,
        accountId: senderAccount.id,
      });
    } else {
      this.transferStore.updateFeeInfo(0, 0);
    }
  }

  private setupFeeCalculation(): void {
    this.feeUpdateSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) =>
            prev.amount === curr.amount && prev.accountId === curr.accountId,
        ),
        switchMap(({ amount, accountId }) =>
          this.transfersApi.getFee(accountId, amount).pipe(
            tap((response) => {
              const fee =
                typeof response === 'number' ? response : (response?.fee ?? 0);
              this.transferStore.updateFeeInfo(fee, amount + fee);
            }),
            catchError(() => {
              this.transferStore.updateFeeInfo(0, 0);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
