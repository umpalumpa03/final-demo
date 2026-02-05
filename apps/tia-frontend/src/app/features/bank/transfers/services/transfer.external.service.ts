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
      this.transferStore.setInsufficientBalance(false);
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
    const balance = senderAccount?.balance ?? 0;
    const isExternalBank =
      this.transferStore.recipientType() === 'iban-different-bank';

    if (numericAmount > balance) {
      this.transferStore.setInsufficientBalance(true);
      this.transferStore.updateFeeInfo(0, numericAmount);
      return;
    }

    this.transferStore.setInsufficientBalance(false);

    if (numericAmount > 0 && senderAccount?.id) {
      if (isExternalBank) {
        this.transferStore.setFeeLoading(true);
        this.feeUpdateSubject.next({
          amount: numericAmount,
          accountId: senderAccount.id,
        });
      } else {
        this.transferStore.updateFeeInfo(0, numericAmount);
      }
    } else {
      this.transferStore.updateFeeInfo(0, 0);
    }
  }

  private setupFeeCalculation(): void {
    this.feeUpdateSubject
      .pipe(
        debounceTime(300),
        switchMap(({ amount, accountId }) =>
          this.transfersApi.getFee(accountId, amount).pipe(
            tap((response) => {
              if (this.transferStore.amount() !== amount) {
                this.transferStore.setFeeLoading(false);
                return;
              }

              const fee =
                typeof response === 'number' ? response : response.fee;
              const total = amount + fee;
              this.transferStore.updateFeeInfo(fee, total);
              this.transferStore.setFeeLoading(false);

              const balance = this.transferStore.senderAccount()?.balance ?? 0;
              this.validateBalance(total, balance);
            }),
            catchError(() => {
              this.transferStore.updateFeeInfo(0, 0);
              this.transferStore.setFeeLoading(false);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
  public validateBalance(
    totalWithFee: number,
    availableBalance: number,
  ): boolean {
    const isInsufficient = totalWithFee > availableBalance;
    this.transferStore.setInsufficientBalance(isInsufficient);
    return !isInsufficient;
  }
  public handleSameBankTransfer(): void {
    const senderAccount = this.transferStore.senderAccount();
    const recipientAccount = this.transferStore.selectedRecipientAccount();
    const amount = this.transferStore.amount();
    const description = this.transferStore.description();

    if (!senderAccount?.id || !recipientAccount?.iban || amount <= 0) {
      return;
    }

    this.transferStore.setLoading(true);
    this.transferStore.setError('');
    this.transfersApi
      .transferSameBank({
        senderAccountId: senderAccount.id,
        receiverAccountIban: recipientAccount.iban,
        description: description || 'Transfer to someone',
        amountToSend: amount,
      })
      .pipe(
        tap((response) => {
          const requiresOtp = response.verify.method !== null;

          this.transferStore.setChallengeId(response.verify.challengeId);
          this.transferStore.setRequiresOtp(requiresOtp);
          this.transferStore.setLoading(false);

          if (!requiresOtp) {
            this.verifyTransfer();
          }
        }),
        catchError((error) => {
          this.transferStore.setLoading(false);
          this.transferStore.setError(
            error?.error?.message || 'Transfer failed',
          ); //needschange

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public handleOtherBankTransfer(): void {
    const senderAccount = this.transferStore.senderAccount();
    const receiverAccountIban = this.transferStore.recipientInput();
    const amount = this.transferStore.amount();
    const receiverName = this.transferStore.manualRecipientName();
    const receiverCurrency = this.transferStore.senderAccount()?.currency;
    const description = this.transferStore.description();

    if (
      amount <= 0 ||
      !receiverAccountIban ||
      !senderAccount?.id ||
      !receiverCurrency
    )
      return;

    this.transferStore.setLoading(true);
    this.transferStore.setError('');
    this.transfersApi
      .transferExternalBank({
        senderAccountId: senderAccount.id,
        receiverAccountIban: receiverAccountIban,
        receiverAccountCurrency: receiverCurrency,
        receiverName: receiverName,
        amountToSend: amount,
        description: description || 'Transfer to someone',
      })
      .pipe(
        tap((response) => {
          const requiresOtp = response.verify.method !== null;

          this.transferStore.setChallengeId(response.verify.challengeId);
          this.transferStore.setRequiresOtp(requiresOtp);
          this.transferStore.setLoading(false);
          if (!requiresOtp) {
            this.verifyTransfer();
          }
        }),
        catchError((error) => {
          this.transferStore.setLoading(false);
          this.transferStore.setError(
            error?.error?.message || 'Transfer Failed',
          );//needs change

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
  public verifyTransfer(code?: string): void {
    const challengeId = this.transferStore.challengeId();

    if (!challengeId) {
      return;
    }

    this.transferStore.setLoading(true);

    this.transfersApi
      .verifyTransfer({
        challengeId,
        ...(code && { code }),
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.transferStore.setRequiresOtp(false);
            this.transferStore.setTransferSuccess(true);
          }
          this.transferStore.setLoading(false);
          //here we need to catch success false from response on otp code
        }),
        catchError((error) => {
          this.transferStore.setLoading(false);
          this.transferStore.setError(error?.error?.message);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
