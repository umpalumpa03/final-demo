import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, take } from 'rxjs';
import { TransferStore } from '../store/transfers.store';
import { TransfersApiService } from './transfersApi.service';
import { TransferValidationService } from '../components/transfers-external/services/transfer-validation.service';
import { TransferUtilsService } from './transfer-utils.service';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';
import { RecipientAccount } from '../models/transfers.state.model';

@Injectable()
export class TransferRepeatService {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly transferStore = inject(TransferStore);
  private readonly transfersApi = inject(TransfersApiService);
  private readonly validationService = inject(TransferValidationService);
  private readonly utilsService = inject(TransferUtilsService);
  private readonly destroyRef = inject(DestroyRef);

  public initRepeatTransfer(transaction: ITransactions): void {
    const isInternal = transaction.transferType === 'ToOwnAccount';

    if (isInternal) {
      this.handleInternalTransfer(transaction);
    } else {
      this.handleExternalTransfer(transaction);
    }
  }

  private handleInternalTransfer(transaction: ITransactions): void {
    this.router.navigate(['/bank/transfers/internal/amount']);
  }

  private handleExternalTransfer(transaction: ITransactions): void {
    if (!transaction.creditAccountNumber) {
      this.transferStore.setRecipientInput(
        transaction.creditAccountNumber || '',
      );
      this.transferStore.setError('transfers.repeat.invalidIban');
      this.router.navigate(['/bank/transfers/external/recipient']);
      return;
    }

    const recipientType = this.validationService.identifyRecipientType(
      transaction.creditAccountNumber,
    );

    if (!recipientType) {
      this.transferStore.setRecipientInput(transaction.creditAccountNumber);
      this.transferStore.setError('transfers.repeat.invalidIban');
      this.router.navigate(['/bank/transfers/external/recipient']);
      return;
    }

    if (recipientType === 'iban-different-bank') {
      this.handleExternalBank(transaction);
    } else {
      this.handleSameBank(transaction, recipientType);
    }
  }

  private handleExternalBank(transaction: ITransactions): void {
    this.transferStore.setExternalRecipient(
      transaction.creditAccountNumber!,
      'iban-different-bank',
    );
    this.transferStore.setManualRecipientName(
      transaction.meta?.['recipientName'] || '',
    );

    this.store
      .select(selectAccounts)
      .pipe(take(1))
      .subscribe((accounts) => {
        const senderAccount = accounts.find(
          (acc) => acc.iban === transaction.debitAccountNumber,
        );

        if (!senderAccount) {
          this.transferStore.setError(
            'transfers.external.accounts.senderNotFound',
          );
          this.router.navigate(['/bank/transfers/external/accounts']);
          return;
        }

        if (
          !this.utilsService.isSenderAccountValid(senderAccount, null, true)
        ) {
          this.transferStore.setError(
            'transfers.external.accounts.noPermission',
          );
          this.router.navigate(['/bank/transfers/external/accounts']);
          return;
        }

        this.transferStore.setSenderAccount(senderAccount);
        this.transferStore.setAmount(transaction.amount);
        this.transferStore.setDescription(transaction.description);
        this.transferStore.updateFeeInfo(0, transaction.amount);
        this.router.navigate(['/bank/transfers/external/amount']);
      });
  }

  private handleSameBank(
    transaction: ITransactions,
    recipientType: 'phone' | 'iban-same-bank',
  ): void {
    this.transferStore.setLoading(true);

    this.transfersApi
      .lookupByIban(transaction.creditAccountNumber!)
      .pipe(
        tap((recipientInfo) => {
          let recipientAccount: RecipientAccount | null = null;

          if (recipientInfo.accounts && recipientInfo.accounts.length > 0) {
            recipientAccount =
              recipientInfo.accounts.find(
                (acc) => acc.currency === transaction.currency,
              ) || recipientInfo.accounts[0];
          } else if (
            recipientInfo.currency &&
            transaction.creditAccountNumber
          ) {
            recipientAccount = {
              id: 'iban-recipient',
              iban: transaction.creditAccountNumber,
              currency: recipientInfo.currency,
              name: recipientInfo.fullName,
            };
          }

          if (!recipientAccount) {
            this.transferStore.setRecipientInput(
              transaction.creditAccountNumber!,
            );
            this.transferStore.setError(
              'transfers.repeat.recipientAccountNotFound',
            );
            this.transferStore.setLoading(false);
            this.router.navigate(['/bank/transfers/external/recipient']);
            return;
          }

          this.transferStore.setRecipientInfo(
            recipientInfo,
            transaction.creditAccountNumber!,
            recipientType,
          );
          this.transferStore.setSelectedRecipientAccount(recipientAccount);
          this.transferStore.setLoading(false);

          this.store
            .select(selectAccounts)
            .pipe(take(1))
            .subscribe((accounts) => {
              const senderAccount = accounts.find(
                (acc) => acc.iban === transaction.debitAccountNumber,
              );

              if (!senderAccount) {
                this.transferStore.setError(
                  'transfers.external.accounts.senderNotFound',
                );
                this.router.navigate(['/bank/transfers/external/accounts']);
                return;
              }

              if (
                !this.utilsService.isSenderAccountValid(
                  senderAccount,
                  recipientAccount,
                  false,
                )
              ) {
                this.transferStore.setError(
                  'transfers.repeat.senderNoPermission',
                );
                this.router.navigate(['/bank/transfers/external/accounts']);
                return;
              }

              this.transferStore.setSenderAccount(senderAccount);
              this.transferStore.setAmount(transaction.amount);
              this.transferStore.setDescription(transaction.description);
              this.transferStore.updateFeeInfo(0, transaction.amount);

              this.router.navigate(['/bank/transfers/external/amount']);
            });
        }),
        catchError((error) => {
          this.transferStore.setRecipientInput(
            transaction.creditAccountNumber!,
          );
          this.transferStore.setError('transfers.repeat.recipientNotFound');
          this.transferStore.setLoading(false);
          this.router.navigate(['/bank/transfers/external/recipient']);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
