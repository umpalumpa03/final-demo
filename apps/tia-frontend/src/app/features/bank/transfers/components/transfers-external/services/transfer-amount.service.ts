import { inject, Injectable, DestroyRef } from '@angular/core';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';

@Injectable()
export class TransferAmountService {
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly transfersApi = inject(TransfersApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly feeUpdateSubject = new Subject<{
    amount: number;
    accountId: string;
  }>();

  constructor() {
    this.setupFeeCalculation();
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

  public validateBalance(
    totalWithFee: number,
    availableBalance: number,
  ): boolean {
    const isInsufficient = totalWithFee > availableBalance;
    this.transferStore.setInsufficientBalance(isInsufficient);
    return !isInsufficient;
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
}
