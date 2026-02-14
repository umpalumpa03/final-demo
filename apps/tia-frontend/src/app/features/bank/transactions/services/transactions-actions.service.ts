import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SimpleAlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { TransactionsFacadeService } from './transactions-facade.service';
import * as XLSX from 'xlsx';
import { ITransactionExportRow } from '../models/transactions-excel.models';
import { AlertService } from '@tia/core/services/alert/alert.service';

@Injectable()
export class TransactionsActionsService {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly facade = inject(TransactionsFacadeService);
  private readonly alertService = inject(AlertService);

  public readonly isCategorizeModalOpen = signal<boolean>(false);
  public readonly selectedTransaction = signal<ITransactions | null>(null);
  public readonly isFiltersOpen = signal<boolean>(false);

  public showValidationAlert(type: SimpleAlertType, messageKey: string): void {
    const message = this.translate.instant(messageKey);

    switch (type) {
      case 'warning':
        this.alertService.warning(message, {
          variant: 'dismissible',
          title: 'Warning',
        });
        break;
      case 'error':
        this.alertService.error(message, {
          variant: 'dismissible',
          title: 'Error',
        });
        break;
      case 'success':
        this.alertService.success(message, {
          variant: 'dismissible',
          title: 'Success',
        });
        break;
    }
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

    if (transaction.transferType === 'BillPayment') {
      route = '/bank/paybill';
    } else if (transaction.transferType.startsWith('OwnAccount')) {
      route = '/bank/transfers/internal';
    } else if (
      transaction.transferType === 'ToSomeoneSameBank' ||
      transaction.transferType === 'ToSomeoneOtherBank'
    ) {
      route = '/bank/transfers/external';
    }

    this.router.navigate([route]);
  }

  public exportSingleTransaction(transaction: ITransactions): void {
    const exportData = [this.mapToExportRow(transaction)];
    this.generateAndDownloadExcel(exportData, `Transaction_${transaction.id}`);
  }

  public exportTransactionsTable(): void {
    const data = this.facade.items();

    if (!data || data.length === 0) {
      this.showValidationAlert(
        'warning',
        'transactions.alerts.no_data_to_export',
      );
      return;
    }

    const exportData = data.map((item) => this.mapToExportRow(item));

    this.generateAndDownloadExcel(
      exportData,
      `Transactions_Table_${new Date().toISOString().slice(0, 10)}`,
    );
  }

  private mapToExportRow(item: ITransactions): ITransactionExportRow {
    let categoryName = 'Uncategorized';

    if (typeof item.category === 'string') {
      categoryName = item.category;
    } else if (item.category && item.category.categoryName) {
      categoryName = item.category.categoryName;
    }

    return {
      ID: item.id,
      Date: item.createdAt,
      Amount: item.amount,
      Currency: item.currency,
      Description: item.description,
      Category: categoryName,
      Status: item.transactionType,
      TransferType: item.transferType,
    };
  }

  private generateAndDownloadExcel<T>(data: T[], fileNamePrefix: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    const fileName = fileNamePrefix.endsWith('.xlsx')
      ? fileNamePrefix
      : `${fileNamePrefix}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }

  public toggleFilters(): void {
    this.isFiltersOpen.update((v) => !v);
  }
}
