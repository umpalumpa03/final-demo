import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  combineLatest,
  map,
  of,
  switchMap,
  filter,
  take,
  BehaviorSubject,
  tap,
  startWith,
} from 'rxjs';
import {
  loadCardDetails,
  loadCardAccounts,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetailById,
  selectAccountById,
  selectAccountsLoaded,
  selectLoadedCardDetailsIds,
} from '../../../../../../../../store/products/cards/cards.selectors';

import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TransactionCardHeader } from '../components/transaction-card-header/transaction-card-header';
import { TransactionList } from '../components/transaction-list/transaction-list';
import {
  selectError,
  selectFilters,
  selectIsLoading,
  selectItems,
  selectNextCursor,
  selectTransactionsLoaded,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { Pagination } from '@tia/shared/lib/navigation/pagination/pagination';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ITransactionFilter,
  ITransactions,
} from '@tia/shared/models/transactions/transactions.models';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';

@Component({
  selector: 'app-card-transactions',
  templateUrl: './card-transactions.html',
  styleUrls: ['./card-transactions.scss'],
  imports: [
    CommonModule,
    RouteLoader,
    ButtonComponent,
    BasicCard,
    ErrorStates,
    TransactionCardHeader,
    TransactionList,
    Pagination,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTransactions implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly accountsLoaded$ = this.store.select(selectAccountsLoaded);
  private readonly loadedCardDetailsIds$ = this.store.select(
    selectLoadedCardDetailsIds,
  );
  private readonly cardId = this.route.snapshot.paramMap.get('cardId') || '';

  protected readonly loading$ = this.store.select(selectIsLoading);
  protected readonly error$ = this.store.select(selectError);
  protected readonly transactions$ = this.store.select(selectItems);

  private readonly translate = inject(TranslateService);
  private readonly currentPageSubject = new BehaviorSubject<number>(1);
  protected readonly currentPage$ = this.currentPageSubject.asObservable();
  protected readonly itemsPerPage = 20;

  private readonly destroyRef = inject(DestroyRef);
  protected readonly uncategorizedText$ = this.translate.stream(
    'my-products.card.card-transactions.transaction-list.uncategorized',
  );

  protected readonly currentLocale$ = this.translate.onLangChange.pipe(
    map((event) => (event.lang === 'ka' ? 'ka-GE' : 'en-US')),
    startWith(this.translate.currentLang === 'ka' ? 'ka-GE' : 'en-US'),
  );

  protected readonly cardHeaderData$ = combineLatest([
    this.store.select(selectCardDetailById(this.cardId)),
  ]).pipe(
    switchMap(([cardData]) => {
      if (!cardData?.details?.accountId) return of(null);

      return this.store
        .select(selectAccountById(cardData.details.accountId))
        .pipe(
          map((account) => {
            if (!account) return null;

            return {
              cardId: this.cardId,
              imageBase64: cardData.imageBase64,
              cardName: cardData.details.cardName,
              maskedNumber: '•••• •••• •••• ' + account.iban.slice(-4),
            };
          }),
        );
    }),
    startWith(null),
  );

  protected readonly accountName$ = combineLatest([
    this.store.select(selectCardDetailById(this.cardId)),
  ]).pipe(
    switchMap(([cardData]) => {
      if (!cardData?.details?.accountId) return of('N/A');
      return this.store
        .select(selectAccountById(cardData.details.accountId))
        .pipe(map((account) => account?.name || 'N/A'));
    }),
  );

  protected handleBack(): void {
    this.router.navigate(['/bank/products/cards/details', this.cardId]);
  }

  protected handleRetry(): void {
    this.loadData();
  }

  private loadData(): void {
    this.store.dispatch(loadCardAccounts({}));
    this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
  }

  protected readonly isLoading$ = combineLatest([
    this.accountsLoaded$,
    this.store.select(selectIsLoading),
    this.store.select(selectCardDetailById(this.cardId)),
    this.store.select(selectItems),
    this.store.select(selectTransactionsLoaded),
  ]).pipe(
    map(
      ([
        accountsLoaded,
        loading,
        cardData,
        transactions,
        transactionsLoaded,
      ]) => {
        if (!accountsLoaded) return true;
        if (!cardData) return true;
        if (loading) return true;
        if (!transactionsLoaded && transactions.length === 0) return true;
        return false;
      },
    ),
    startWith(true),
  );

  protected getTotalCount(transactions: ITransactions[]): number {
    return transactions?.length || 0;
  }

  protected getPaginatedTransactions(
    transactions: ITransactions[],
    page: number,
  ): ITransactions[] {
    if (!transactions) return [];
    const startIndex = (page - 1) * this.itemsPerPage;
    return transactions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  protected getTotalPages(transactions: ITransactions[]): number {
    if (!transactions) return 0;
    return Math.ceil(transactions.length / this.itemsPerPage);
  }

  protected handlePageChange(page: number): void {
    this.currentPageSubject.next(page);
  }

  private autoLoadAllTransactions(): void {
    this.store
      .select(selectNextCursor)
      .pipe(
        filter((cursor) => cursor !== null),
        tap(() => {
          this.store.dispatch(TransactionActions.loadMore());
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(loadCardAccounts({}));

    this.store
      .select(selectAccountsLoaded)
      .pipe(
        filter((loaded) => loaded === true),
        take(1),
        tap(() => {
          this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
          this.initializeTransactionFilters();
          this.autoLoadAllTransactions();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private initializeTransactionFilters(): void {
    combineLatest([
      this.store.select(selectCardDetailById(this.cardId)),
      this.store.select(selectFilters),
      this.store.select(selectTransactionsLoaded),
    ])
      .pipe(
        filter(([cardData, filters, loaded]) => !!cardData?.details?.accountId),
        take(1),
        switchMap(([cardData, filters, loaded]) =>
          this.store
            .select(selectAccountById(cardData!.details.accountId))
            .pipe(
              filter((account) => !!account),
              take(1),
              map((account) => ({ account, filters, loaded })),
            ),
        ),
        tap(({ account, filters, loaded }) => {
          const isSameAccount = filters?.accountIban === account!.iban;

          if (!loaded || !isSameAccount) {
            this.store.dispatch(TransactionActions.enter());
            this.store.dispatch(
              TransactionActions.updateFilters({
                filters: { accountIban: account!.iban, pageLimit: 100 },
              }),
            );
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
  protected readonly paginationConfig = computed(() => ({
    previousLabel: ' ',
    nextLabel: ' ',
    maxVisiblePages: 2,
    showEllipsis: true,
  }));
}
