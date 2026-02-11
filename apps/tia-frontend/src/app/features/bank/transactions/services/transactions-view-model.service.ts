import { computed, inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionsFacadeService } from './transactions-facade.service';
import { TRANSACTIONS_BASE_CONFIG } from '../config/transaction-data';
import { convertTransactionData } from '../utils/data-converter.utils';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

@Injectable()
export class TransactionsViewModelService {
  private readonly facade = inject(TransactionsFacadeService);
  private readonly translate = inject(TranslateService);

  private readonly currentLang = toSignal(this.translate.onLangChange);

  public readonly isEmpty = computed(() => this.facade.items().length === 0);

  public readonly currencyOptions = computed(() => {
    return this.facade
      .currencyList()
      .map((curr) => ({ label: curr, value: curr }));
  });

  public readonly accountOptions = computed(() => {
    const accountsList = this.facade.accounts();
    if (!accountsList) return [];
    return accountsList.map((acc) => ({
      label: `${acc.friendlyName}`,
      value: acc.iban,
    }));
  });

  public readonly totalTransactionsString = computed(() => {
    this.currentLang();
    const total = this.facade.totalTransactions().toString();
    const itemsFetched = this.facade.items().length.toString();

    return this.translate.instant('transactions.table.showing_text', {
      fetched: itemsFetched,
      total: total,
    });
  });

  public readonly tableConfig = computed<TableConfig>(() => {
    this.currentLang();

    return {
      ...TRANSACTIONS_BASE_CONFIG,
      headers: TRANSACTIONS_BASE_CONFIG.headers.map((h) => ({
        ...h,
        title: this.translate.instant(h.title),
      })),
      rows: this.facade.items().map((transaction) => {
        const formattedRow = convertTransactionData(transaction);
        return {
          ...formattedRow,
          hasMeta:
            (!!transaction.meta && Object.keys(transaction.meta).length > 0) ||
            ([
              'ToSomeoneSameBank',
              'ToSomeoneOtherBank',
              'OwnAccountSameCurrency',
              'OwnAccountDifferentCurrency',
            ].includes(transaction.transferType) &&
              transaction.transactionType !== 'credit'),
        };
      }),
    };
  });
}
