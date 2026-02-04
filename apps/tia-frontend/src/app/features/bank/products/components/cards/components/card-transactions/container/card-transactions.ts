import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { combineLatest, map, of, switchMap } from 'rxjs';
import {
  loadCardTransactions,
  loadCardDetails,
  loadCardAccounts,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetailById,
  selectCardTransactionsByCardId,
  selectCardTransactionsLoading,
  selectCardTransactionsError,
  selectCardTransactionsTotalByCardId,
  selectAccountById,
  selectCardTransactions,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionCardHeader } from '../components/transaction-card-header/transaction-card-header';
import { TransactionList } from '../components/transaction-list/transaction-list';

@Component({
  selector: 'app-card-transactions',
  templateUrl: './card-transactions.html',
  styleUrls: ['./card-transactions.scss'],
  imports: [
    CommonModule,
    RouteLoader,
    ButtonComponent,
    BasicCard,
    ErrorStates,TransactionCardHeader,TransactionList
    
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTransactions implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly cardId = this.route.snapshot.paramMap.get('cardId') || '';

  protected readonly loading$ = this.store.select(selectCardTransactionsLoading);
  protected readonly error$ = this.store.select(selectCardTransactionsError);

protected readonly transactions$ = this.store.select(
  selectCardTransactionsByCardId(this.cardId)
);
  protected readonly totalCount$ = this.store.select(
    selectCardTransactionsTotalByCardId(this.cardId)
  );

  protected readonly cardHeaderData$ = combineLatest([
    this.store.select(selectCardDetailById(this.cardId)),
  ]).pipe(
    map(([cardData]) => {
      if (!cardData) return null;
      
      return {
        cardId: this.cardId,
        imageBase64: cardData.imageBase64,
        cardName: cardData.details.cardName,
        maskedNumber: '•••• •••• •••• ' + this.cardId.slice(-4),
      };
    })
  );

 protected readonly accountName$ = combineLatest([
  this.store.select(selectCardDetailById(this.cardId)),
]).pipe(
  switchMap(([cardData]) => {
    if (!cardData?.details?.accountId) return of('N/A');
    return this.store.select(selectAccountById(cardData.details.accountId)).pipe(
      map((account) => account?.name || 'N/A')
    );
  })
);
  ngOnInit(): void {
    this.loadData();
  }

  protected handleBack(): void {
    this.router.navigate(['/bank/products/cards', this.cardId]);
  }

  protected handleRetry(): void {
    this.loadData();
  }

  // private loadData(): void {
  //   this.store.dispatch(loadCardAccounts());
  //   this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
  //   this.store.dispatch(loadCardTransactions({ cardId: this.cardId }));
  // }

private loadData(): void {
  this.store.dispatch(loadCardAccounts());
  this.store.dispatch(loadCardDetails({ cardId: this.cardId }));
}
}