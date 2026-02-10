import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimpleAlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { TransactionsFacadeService } from './transactions-facade.service';

@Injectable()
export class TransactionsActionsService {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private facade = inject(TransactionsFacadeService);

  public isCategorizeModalOpen = signal<boolean>(false);
  public selectedTransaction = signal<ITransactions | null>(null);
  public alertMessage = signal<string | null>(null);
  public alertType = signal<SimpleAlertType>('warning');

  public showValidationAlert(type: SimpleAlertType, messageKey: string): void {
    this.alertType.set(type);
    this.alertMessage.set(this.translate.instant(messageKey));
    setTimeout(() => this.alertMessage.set(null), 3000);
  }

  public openCategorizeModal(transaction: ITransactions): void {
    this.selectedTransaction.set(transaction);
    this.isCategorizeModalOpen.set(true);
  }

  public closeCategorizeModal(): void {
    this.isCategorizeModalOpen.set(false);
    this.selectedTransaction.set(null);
  }

  public saveCategory(transactionId: string, categoryId: string): void {
    this.facade.assignCategory(transactionId, categoryId);
    this.closeCategorizeModal();
  }

  public handleRepeatAction(transaction: ITransactions): void {
    if (transaction.transactionType === 'credit') {
      this.showValidationAlert('warning', 'transactions.alerts.income_warning');
      return;
    }
    if (transaction.transferType === 'Loan') {
      this.showValidationAlert('warning', 'transactions.alerts.loan_warning');
      return;
    }

    this.navigateToRepeat(transaction);
  }

  private navigateToRepeat(transaction: ITransactions): void {
    this.facade.setTransactionToRepeat(transaction);

    let route = '/bank/transfers/';
    if (transaction.transferType === 'BillPayment') route = '/bank/paybill';
    else if (transaction.transferType === 'OwnAccount')
      route = '/bank/transfers/internal';
    else if (
      ['ToSomeoneSameBank', 'ToSomeoneOtherBank'].includes(
        transaction.transferType,
      )
    ) {
      route = '/bank/transfers/external';
    }

    this.router.navigate([route]);
  }
}
