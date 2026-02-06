import { inject, Injectable, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';

@Injectable()
export class TransferExecutionService {
  private readonly transferStore = inject(TransferStore);
  private readonly transfersApi = inject(TransfersApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

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
          );

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
          );

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
          } else {
            this.transferStore.setError(response.message || 'Invalid OTP code');
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
}
