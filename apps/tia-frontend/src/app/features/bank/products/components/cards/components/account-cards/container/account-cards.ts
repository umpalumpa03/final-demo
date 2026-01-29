import {
  ChangeDetectionStrategy,
  Component,
  inject,
  effect,
  signal,
  DestroyRef,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CardAccount } from '../../../models/card-account.model';
import { CardWithDetails } from '../../../models/card-image.model';

@Component({
  selector: 'app-account-cards',
  standalone: true,
  templateUrl: './account-cards.html',
  styleUrls: ['./account-cards.scss'],
  imports: [CommonModule, Badges],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCards {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly accountId = this.route.snapshot.paramMap.get('accountId') || '';
  private readonly accounts = signal<CardAccount[]>([]);
  private readonly cards = signal<CardWithDetails[]>([]);

  protected readonly vm = computed(() => {
    const account = this.accounts().find(acc => acc.id === this.accountId);
    if (!account) return null;
    return { account, cards: this.cards() };
  });

  private readonly accountsSubscription = this.store.select(selectAllAccounts)
    .pipe(
      tap(accounts => this.accounts.set(accounts)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly cardsSubscription = this.store.select(selectCardDetailsByAccountId(this.accountId))
    .pipe(
      tap(cards => this.cards.set(cards)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  constructor() {
    effect(() => {
      const data = this.vm();
      if (data?.account?.cardIds && data.account.cardIds.length > 0) {
        data.account.cardIds.forEach(cardId => {
          this.store.dispatch(loadCardDetails({ cardId }));
        });
      }
    });
  }

  protected handleCardClick(cardId: string): void {
    this.router.navigate(['/bank/products/cards/details', cardId]);
  }

  protected shouldShowCreditLimit(card: CardWithDetails): boolean {
    return card.details.type === 'CREDIT' && !!card.details.creditLimit;
  }
}