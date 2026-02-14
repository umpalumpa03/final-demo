import { DestroyRef, inject, Injectable } from '@angular/core';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { catchError, of, tap } from 'rxjs';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TransfersApiService } from 'apps/tia-frontend/src/app/features/bank/transfers/services/transfersApi.service';

const INTERNAL_TRANSFER_SELECTION_KEY = 'tia.internalTransfer.selection';

interface InternalTransferSelection {
  senderAccountId: string | null;
  receiverOwnAccountId: string | null;
}

@Injectable()
export class TransferInternalService {
  private readonly transferStore = inject(TransferStore);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly transfersApi = inject(TransfersApiService);
  private readonly destroyRef = inject(DestroyRef);

  public handleFromAccountSelect(account: Account, currentSelection: Account | null): void {
    if (currentSelection?.id === account.id) {
      this.transferStore.setSenderAccount(null);
    } else {
      this.transferStore.setSenderAccount(account);
    }
    this.saveInternalSelection();
  }

  public handleToAccountSelect(account: Account, currentSelected: Account | null) {
    if (currentSelected?.id === account.id) {
      this.transferStore.setReceiverOwnAccount(null);
    } else {
      this.transferStore.setReceiverOwnAccount(account);
    }
    this.saveInternalSelection();
  }

  public restoreInternalSelection(accounts: Account[]): void {
    const stored = this.getInternalSelection();
    if (!stored || !accounts.length) return;

    const sender = stored.senderAccountId
      ? accounts.find((a) => a.id === stored.senderAccountId)
      : null;
    const receiver = stored.receiverOwnAccountId
      ? accounts.find((a) => a.id === stored.receiverOwnAccountId)
      : null;

    if (sender) this.transferStore.setSenderAccount(sender);
    if (receiver) this.transferStore.setReceiverOwnAccount(receiver);
  }

  public clearInternalSelection(): void {
      sessionStorage.removeItem(INTERNAL_TRANSFER_SELECTION_KEY);
  }

  private saveInternalSelection(): void {
    const sender = this.transferStore.senderAccount();
    const receiver = this.transferStore.receiverOwnAccount();
    const data: InternalTransferSelection = {
      senderAccountId: sender?.id ?? null,
      receiverOwnAccountId: receiver?.id ?? null,
    };
      sessionStorage.setItem(
        INTERNAL_TRANSFER_SELECTION_KEY,
        JSON.stringify(data),
      );

  }

  private getInternalSelection(): InternalTransferSelection | null {
    try {
      const raw = sessionStorage.getItem(INTERNAL_TRANSFER_SELECTION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as InternalTransferSelection;
    } catch {
      return null;
    }
  }

  public handleAmountGoBack(amount: number, description: string): void {
    this.transferStore.setAmount(amount);
    this.transferStore.setDescription(description);
    this.saveInternalSelection();
    this.router.navigate(['/bank/transfers/internal/to-account']);
  }

  public handleAmountInput(amount: number): void {
    const numericAmount = Number(amount);
    this.transferStore.setAmount(numericAmount);

    const senderAccount = this.transferStore.senderAccount();
    const balance = senderAccount?.balance ?? 0;

    if (numericAmount > balance) {
      this.transferStore.setInsufficientBalance(true);
    } else {
      this.transferStore.setInsufficientBalance(false);
    }
  }

  public handleToOwnTransfer(): void {
    const senderAccount = this.transferStore.senderAccount();
    const receiverAccount = this.transferStore.receiverOwnAccount();
    const amount = this.transferStore.amount();
    const description = this.transferStore.description();

    if (!senderAccount?.id || !receiverAccount?.iban || amount <= 0) {
      return;
    }

    this.transferStore.setLoading(true);
    this.transferStore.setError('');

    this.transfersApi
      .transferToOwn({
        senderAccountId: senderAccount.id,
        receiverAccountId: receiverAccount.id,
        description: description || 'To Own transfer',
        amountToSend: amount,
      })
      .pipe(
        tap((response) => {
          this.transferStore.setLoading(false);

          if (response.verify?.challengeId) {
            this.transferStore.setChallengeId(response.verify.challengeId);

            if (response.verify.method === null) {
              this.verifyTransfer();
            } else {
              this.transferStore.setRequiresOtp(true);
              this.router.navigate(['/bank/transfers/verify']);
            }
          } else {
            this.transferStore.setTransferSuccess(true);
            this.store.dispatch(
              AccountsActions.loadAccounts({ forceRefresh: true }),
            );
          }
        }),
        catchError((error) => {
          this.transferStore.setLoading(false);
          this.transferStore.setError(error?.error?.message || 'Transfer failed');
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

            this.store.dispatch(
              AccountsActions.loadAccounts({ forceRefresh: true }),
            );
          }
          this.transferStore.setLoading(false);

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

  public handleCrossCurrencyTransfer(isReverse: boolean): void {
    const senderAccount = this.transferStore.senderAccount();
    const receiverAccount = this.transferStore.receiverOwnAccount();
    const amount = this.transferStore.amount();
    const description = this.transferStore.description();

    if (!senderAccount?.id || !receiverAccount?.id || amount <= 0) {
      return;
    }

    this.transferStore.setLoading(true);
    this.transferStore.setError('');

    this.transfersApi
      .transferCrossCurrency({
        senderAccountId: senderAccount.id,
        receiverAccountId: receiverAccount.id,
        description: description || 'Cross-currency transfer',
        amountToSend: amount,
        isReverse: isReverse,
      })
      .pipe(
        tap((response) => {
          this.transferStore.setLoading(false);

          if (response.verify?.challengeId) {
            this.transferStore.setChallengeId(response.verify.challengeId);

            if (response.verify.method === null) {
              this.verifyTransfer();
            } else {
              this.transferStore.setRequiresOtp(true);
              this.router.navigate(['/bank/transfers/verify']);
            }
          } else {
            this.transferStore.setTransferSuccess(true);
            this.store.dispatch(
              AccountsActions.loadAccounts({ forceRefresh: true }),
            );
          }
        }),
        catchError((error) => {
          this.transferStore.setLoading(false);
          this.transferStore.setError(error?.error?.message || 'Transfer failed');
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public fetchConversionRate(
    from: string,
    to: string,
    onSuccess: (rate: number) => void,
    onError?: () => void
  ): void {
    this.transfersApi
      .getConversionRate(from, to, 1)
      .pipe(
        tap((response) => {
          if (response.success) {
            onSuccess(response.rate);
          }
        }),
        catchError((error) => {
          console.error('Failed to fetch conversion rate:', error);
          onError?.();
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
