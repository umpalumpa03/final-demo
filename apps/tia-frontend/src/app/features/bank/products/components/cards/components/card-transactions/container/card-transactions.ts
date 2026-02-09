
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
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
  takeUntil,
  Subject,
} from 'rxjs';
import {
  loadCardDetails,
  loadCardAccounts,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetailById,
  selectAccountById,
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
  selectTotalTransactions,
  selectTransactionsLoaded,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { Pagination } from '@tia/shared/lib/navigation/pagination/pagination';
import { TranslatePipe } from '@ngx-translate/core';

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
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTransactions implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly cardId = this.route.snapshot.paramMap.get('cardId') || '';

  protected readonly loading$ = this.store.select(selectIsLoading);
  protected readonly error$ = this.store.select(selectError);
  protected readonly transactions$ = this.store.select(selectItems);
  protected readonly totalCount$ = this.transactions$.pipe(
    map((transactions) => transactions.length),
  );

  private readonly currentPageSubject = new BehaviorSubject<number>(1);
  protected readonly currentPage$ = this.currentPageSubject.asObservable();
  protected readonly itemsPerPage = 20;
  private readonly destroy$ = new Subject<void>();

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
  this.store.select(selectIsLoading),
  this.store.select(selectCardDetailById(this.cardId)),
  this.store.select(selectItems),
]).pipe(
  map(([loading, cardData, transactions]) => {
    return loading && (!cardData || !transactions || transactions.length === 0);
  }),
);

  protected readonly paginatedTransactions$ = combineLatest([
    this.transactions$,
    this.currentPage$,
  ]).pipe(
    map(([transactions, page]) => {
      if (!transactions) return [];
      const startIndex = (page - 1) * this.itemsPerPage;
      return transactions.slice(startIndex, startIndex + this.itemsPerPage);
    }),
  );

  protected readonly totalPages$ = this.transactions$.pipe(
    map((transactions) => {
      if (!transactions) return 0;
      return Math.ceil(transactions.length / this.itemsPerPage);
    }),
  );

  protected handlePageChange(page: number): void {
    this.currentPageSubject.next(page);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private autoLoadAllTransactions(): void {
    this.store
      .select(selectNextCursor)
      .pipe(
        filter((cursor) => cursor !== null),
        tap(() => {
          this.store.dispatch(TransactionActions.loadMore());
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
  


  ngOnInit(): void {
  this.loadData();
  this.initializeTransactionFilters();
  this.autoLoadAllTransactions();
}

private initializeTransactionFilters(): void {
  combineLatest([
    this.store.select(selectCardDetailById(this.cardId)),
    this.store.select(selectFilters),
    this.store.select(selectTransactionsLoaded)
  ]).pipe(
    take(1),
    switchMap(([cardData, currentFilters, loaded]) => {
      if (!cardData?.details?.accountId) {
        return of(null);
      }

      return this.store
        .select(selectAccountById(cardData.details.accountId))
        .pipe(
          take(1),
          tap((account) => {
            this.updateTransactionFiltersIfNeeded(account, currentFilters, loaded);
          }),
        );
    }),
    takeUntil(this.destroy$),
  ).subscribe();
}

private updateTransactionFiltersIfNeeded(
  account: any,
  currentFilters: any,
  loaded: boolean
): void {
  if (!account?.iban) return;

  const needsUpdate = currentFilters.accountIban !== account.iban || !loaded;
  
  if (needsUpdate) {
    this.store.dispatch(TransactionActions.enter());
    this.store.dispatch(
      TransactionActions.updateFilters({
        filters: { accountIban: account.iban, pageLimit: 100 },
      }),
    );
  }
}
  
}
