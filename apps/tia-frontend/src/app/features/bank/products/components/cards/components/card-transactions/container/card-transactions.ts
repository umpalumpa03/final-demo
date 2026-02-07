
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
import { combineLatest, map, of, switchMap, filter, take, BehaviorSubject, tap, takeUntil, Subject } from 'rxjs';
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
import { selectError, selectIsLoading, selectItems, selectNextCursor, selectTotalTransactions } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { createEffect } from '@ngrx/effects';
import { Pagination } from '@tia/shared/lib/navigation/pagination/pagination';

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
    TransactionList,Pagination
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
  map(transactions => transactions.length)
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

      return this.store.select(selectAccountById(cardData.details.accountId)).pipe(
        map((account) => {
          if (!account) return null;

          return {
            cardId: this.cardId,
            imageBase64: cardData.imageBase64,
            cardName: cardData.details.cardName,
            maskedNumber: '•••• •••• •••• ' + account.iban.slice(-4),
          };
        })
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



ngOnInit(): void {
  this.store.dispatch(TransactionActions.enter());
  this.loadData();
  
  const accountIban$ = this.store.select(selectCardDetailById(this.cardId)).pipe(
    filter(cardData => !!cardData?.details?.accountId),
    take(1),
    switchMap(cardData => 
      this.store.select(selectAccountById(cardData!.details.accountId)).pipe(
        filter(account => !!account?.iban),
        take(1)
      )
    ),
    tap(account => {
      this.store.dispatch(TransactionActions.updateFilters({ 
        filters: { accountIban: account!.iban, pageLimit: 100 } 
      }));
    }),
    takeUntil(this.destroy$)
  );

  accountIban$.subscribe();

  this.autoLoadAllTransactions();
}



  protected handleBack(): void {
    this.router.navigate(['/bank/products/cards/details', this.cardId]);
  }

  protected handleRetry(): void {
    this.loadData();
  }


private loadData(): void {
  this.store.dispatch(loadCardAccounts());
  this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
}



  protected readonly isLoading$ = combineLatest([
    this.store.select(selectIsLoading),
    this.store.select(selectCardDetailById(this.cardId)),
    this.store.select(selectItems),
  ]).pipe(
    map(([loading, cardData, transactions]) => {
      return loading && (!cardData || transactions.length === 0);
    }),
  );
  protected readonly paginatedTransactions$ = combineLatest([
  this.transactions$,
  this.currentPage$,
]).pipe(
  map(([transactions, page]) => {
    const startIndex = (page - 1) * this.itemsPerPage;
    return transactions.slice(startIndex, startIndex + this.itemsPerPage);
  })
);

  protected readonly totalPages$ = this.transactions$.pipe(
  map(transactions => Math.ceil(transactions.length / this.itemsPerPage))
);


  protected handlePageChange(page: number): void {
  this.currentPageSubject.next(page);
}
  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete();
  }

  private autoLoadAllTransactions(): void {
  this.store.select(selectNextCursor).pipe(
    filter(cursor => cursor !== null),
    tap(() => {
      this.store.dispatch(TransactionActions.loadMore());
    }),
    takeUntil(this.destroy$)
  ).subscribe();
}
}

