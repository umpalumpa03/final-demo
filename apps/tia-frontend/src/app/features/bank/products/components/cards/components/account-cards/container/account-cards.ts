import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  DestroyRef,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { loadCardAccounts, loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAllAccounts,
  selectCardDetailsByAccountId,
  selectCardDetailsError,
  selectCardDetailsLoading,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardWithDetails } from '@tia/shared/models/cards/card-image.model';

type ViewState = 'loading' | 'error' | 'success' | 'no-account';

@Component({
  selector: 'app-account-cards',
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
  private readonly accountCards = signal<CardWithDetails[]>([]);
  protected readonly cardDetailsLoading = signal<boolean>(false);
  protected readonly cardDetailsError = signal<string | null>(null);

  protected readonly accountData = computed(() => {
    const account = this.accounts().find(acc => acc.id === this.accountId);
    if (!account) return null;
    return { 
      account, 
      cards: this.accountCards() 
    };
  });

  protected readonly viewState = computed((): ViewState => {
    if (!this.accountData()) return 'no-account';
    if (this.cardDetailsLoading()) return 'loading';
    if (this.cardDetailsError()) return 'error';
    return 'success';
  });

  protected readonly cardsLabel = computed(() => {
    const data = this.accountData();
    if (!data) return '';
    const count = data.account.cardIds.length;
    return `${count} Card${count !== 1 ? 's' : ''}`;
  });

  private readonly accountsSubscription = this.store.select(selectAllAccounts)
    .pipe(
      tap(accounts => {
        if (accounts.length === 0) {
          this.store.dispatch(loadCardAccounts());
          return;
        }
        this.accounts.set(accounts);
        const account = accounts.find(acc => acc.id === this.accountId);
        if (account?.cardIds && account.cardIds.length > 0) {
          account.cardIds.forEach(cardId => {
            this.store.dispatch(loadCardDetails({ cardId }));
          });
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly cardsSubscription = this.store.select(selectCardDetailsByAccountId(this.accountId))
    .pipe(
      tap(cards => this.accountCards.set(cards)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly loadingSubscription = this.store.select(selectCardDetailsLoading)
    .pipe(
      tap(loading => this.cardDetailsLoading.set(loading)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  private readonly errorSubscription = this.store.select(selectCardDetailsError)
    .pipe(
      tap(error => this.cardDetailsError.set(error)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();

  protected handleCardClick(cardId: string): void {
    this.router.navigate(['/bank/products/cards/details', cardId]);
  }

  protected shouldShowCreditLimit(card: CardWithDetails): boolean {
    return card.details.type === 'CREDIT' && !!card.details.creditLimit;
  }

  protected getCardBadgeVariant(type: string): 'success' | 'warning' {
    return type === 'DEBIT' ? 'success' : 'warning';
  }
}