import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, combineLatest } from 'rxjs';
import { loadAccountCardsPage } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
  selectCardDetailsError,
  selectCardDetailsLoading,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { AccountData, ViewState } from '@tia/shared/models/cards/account-cards.model';

@Component({
  selector: 'app-account-cards',
  templateUrl: './account-cards.html',
  styleUrls: ['./account-cards.scss'],
  imports: [CommonModule, Badges],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCards implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  private readonly accountId = this.route.snapshot.paramMap.get('accountId') || '';

  protected readonly cardDetailsLoading$ = this.store.select(selectCardDetailsLoading);
  protected readonly cardDetailsError$ = this.store.select(selectCardDetailsError);

  protected readonly accountData$ = combineLatest([
    this.store.select(selectAllAccounts),
    this.store.select(selectCardDetailsByAccountId(this.accountId)),
  ]).pipe(
    map(([accounts, cards]): AccountData | null => {
      const account = accounts.find(acc => acc.id === this.accountId);
      if (!account) return null;
      return { account, cards };
    })
  );

  protected readonly viewState$ = combineLatest([
    this.accountData$,
    this.cardDetailsLoading$,
    this.cardDetailsError$,
  ]).pipe(
    map(([accountData, loading, error]): ViewState => {
      if (!accountData) return 'no-account';
      if (loading) return 'loading';
      if (error) return 'error';
      return 'success';
    })
  );

  protected readonly cardsLabel$ = this.accountData$.pipe(
    map(data => {
      if (!data) return '';
      const count = data.account.cardIds.length;
      return `${count} Card${count !== 1 ? 's' : ''}`;
    })
  );

  ngOnInit(): void {
    this.store.dispatch(loadAccountCardsPage({ accountId: this.accountId }));
  }

  protected handleCardClick(cardId: string): void {
    this.router.navigate(['/bank/products/cards/details', cardId]);
  }
}