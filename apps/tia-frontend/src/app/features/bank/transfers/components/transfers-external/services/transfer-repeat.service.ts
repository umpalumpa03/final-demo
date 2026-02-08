import { inject, Injectable, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, take } from 'rxjs';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { TransferValidationService } from './transfer-validation.service';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { TransferMeta } from '../models/transfer.external.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';

@Injectable()
export class TransferRepeatService {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly transferStore = inject(TransferStore);
  private readonly transfersApi = inject(TransfersApiService);
  private readonly validationService = inject(TransferValidationService);
  private readonly destroyRef = inject(DestroyRef);

  public initRepeatTransfer(meta: TransferMeta): void {
    const recipientType = this.validationService.identifyRecipientType(
      meta.recipientIban,
    );

    if (!recipientType) {
      this.transferStore.setError('transfers.repeat.invalidIban');
      this.router.navigate(['/bank/transfers/external']);
      return;
    }

    this.store
      .select(selectAccounts)
      .pipe(take(1))
      .subscribe((accounts) => {
        const senderAccount = accounts.find(
          (acc) => acc.id === meta.senderAccountId,
        );

        if (!senderAccount) {
          this.transferStore.setError('transfers.repeat.senderNotFound');
          this.router.navigate(['/bank/transfers/external/accounts']);
          return;
        }

        if (recipientType === 'iban-different-bank') {
          this.handleExternalBank(meta, senderAccount);
        } else {
          this.handleSameBank(meta, senderAccount, recipientType);
        }
      });
  }

  private handleExternalBank(meta: TransferMeta, senderAccount: Account): void {
    this.transferStore.setExternalRecipient(
      meta.recipientIban,
      'iban-different-bank',
    );
    this.transferStore.setManualRecipientName(meta.recipientName || '');
    this.transferStore.setSenderAccount(senderAccount);
    this.transferStore.setAmount(meta.amount);
    this.transferStore.setDescription(meta.description);
    this.router.navigate(['/bank/transfers/external/amount']);
  }

  private handleSameBank(
    meta: TransferMeta,
    senderAccount: Account,
    recipientType: 'phone' | 'iban-same-bank',
  ): void {
    this.transferStore.setLoading(true);

    this.transfersApi
      .lookupByIban(meta.recipientIban)
      .pipe(
        tap((recipientInfo) => {
          let recipientAccount = null;

          if (recipientInfo.accounts && recipientInfo.accounts.length > 0) {
            recipientAccount =
              recipientInfo.accounts.find(
                (acc) => acc.currency === senderAccount.currency,
              ) || recipientInfo.accounts[0];
          } else if (recipientInfo.currency) {
            recipientAccount = {
              id: 'iban-recipient',
              iban: meta.recipientIban,
              currency: recipientInfo.currency,
            };
          }

          if (!recipientAccount) {
            this.transferStore.setError(
              'transfers.repeat.recipientAccountNotFound',
            );
            this.transferStore.setLoading(false);
            this.router.navigate(['/bank/transfers/external/accounts']);
            return;
          }

          this.transferStore.setRecipientInfo(
            recipientInfo,
            meta.recipientIban,
            recipientType,
          );
          this.transferStore.setSelectedRecipientAccount(recipientAccount);
          this.transferStore.setSenderAccount(senderAccount);
          this.transferStore.setAmount(meta.amount);
          this.transferStore.setDescription(meta.description);
          this.transferStore.setLoading(false);

          this.router.navigate(['/bank/transfers/external/amount']);
        }),
        catchError((error) => {
          this.transferStore.setError('transfers.repeat.recipientNotFound');
          this.transferStore.setLoading(false);
          this.router.navigate(['/bank/transfers/external']);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
