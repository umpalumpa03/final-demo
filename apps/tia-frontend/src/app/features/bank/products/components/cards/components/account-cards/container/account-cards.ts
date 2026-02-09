import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, combineLatest, take, tap } from 'rxjs';
import { loadAccountCardsPage, setCurrentCardIndex } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
  selectCardDetailsError,
  selectCardDetailsLoading,
} from '../../../../../../../../store/products/cards/cards.selectors';
import {
  AccountData,
  ViewState,
} from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/account-cards.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { AccountHeader } from '../components/account-header/account-header';
import { CardGridItem } from '../components/card-grid-item/card-grid-item';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-cards',
  templateUrl: './account-cards.html',
  styleUrls: ['./account-cards.scss'],
  imports: [
    CommonModule,
    Skeleton,
    ButtonComponent,
    ErrorStates,
    AccountHeader,
    CardGridItem,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCards implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly accountId =
    this.route.snapshot.paramMap.get('accountId') || '';

  protected readonly cardDetailsLoading$ = this.store.select(
    selectCardDetailsLoading,
  );
  protected readonly cardDetailsError$ = this.store.select(
    selectCardDetailsError,
  );

  protected readonly accountData$ = combineLatest([
    this.store.select(selectAllAccounts),
    this.store.select(selectCardDetailsByAccountId(this.accountId)),
  ]).pipe(
    map(([accounts, cards]): AccountData | null => {
      const account = accounts.find((acc) => acc.id === this.accountId);
      if (!account) return null;
      return { account, cards };
    }),
  );

protected readonly viewState$ = combineLatest([
  this.accountData$,
  this.cardDetailsLoading$,
  this.cardDetailsError$,
]).pipe(
  map(([accountData, loading, error]): ViewState => {
    if (!accountData) return 'no-account';
    if (error) return 'error';   
    if (loading) return 'loading'; 
    return 'success';
  })
);


protected readonly cardsLabel$ = this.accountData$.pipe(
  map((data) => {
    if (!data) return { count: '0', key: 'my-products.card.account-cards.account-header.cardCountPlural' };
    const count = data.account.cardIds.length;
    return {
      count: `${count}`,
      key: count === 1 
        ? 'my-products.card.account-cards.account-header.cardCount' 
        : 'my-products.card.account-cards.account-header.cardCountPlural'
    };
  }),
);
ngOnInit(): void {
  this.store.dispatch(loadAccountCardsPage({ accountId: this.accountId }));
}


  public handleCardClick(cardId: string): void {
  this.accountData$.pipe(
    take(1),
    tap(data => {
      if (data) {
        const index = data.account.cardIds.indexOf(cardId);
        this.store.dispatch(setCurrentCardIndex({ cardIndex: index, accountId: this.accountId }));
      }
    })
  ).subscribe();
  
  this.router.navigate(['/bank/products/cards/details', cardId]);
}

  public handleBackClick(): void {
    this.router.navigate(['/bank/products/cards/list']);
  }

 public handleRetry(): void {
  this.store.dispatch(loadAccountCardsPage({ accountId: this.accountId }));
}
}
