import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, combineLatest, take, tap, filter, startWith } from 'rxjs';
import {
  loadAccountCardsPage,
  loadCardAccounts,
  setCurrentCardIndex,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectAccountsLoaded,
  selectAllAccounts,
  selectCardDetailsByAccountId,
  selectCardDetailsError,
  selectCardDetailsLoading,
  selectLoadedCardDetailsIds,
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
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardOtpModal } from '../../otp-modal/container/card-otp-modal/card-otp-modal';

@Component({
  selector: 'app-account-cards',
  templateUrl: './account-cards.html',
  styleUrls: ['./account-cards.scss'],
  imports: [
    CommonModule,
    ButtonComponent,
    ErrorStates,
    AccountHeader,
    CardGridItem,
    TranslatePipe,
    RouteLoader
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCards implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
  private readonly accountsLoaded$ = this.store.select(selectAccountsLoaded);
  private readonly loadedCardDetailsIds$ = this.store.select(
    selectLoadedCardDetailsIds,
  );
  protected readonly viewState$ = combineLatest([
    this.accountsLoaded$,
    this.accountData$,
    this.cardDetailsError$,
    this.loadedCardDetailsIds$,
  ]).pipe(
    map(([accountsLoaded, accountData, error, loadedIds]): ViewState => {
      if (error) return 'error';
      if (!accountsLoaded) return 'loading';
      if (!accountData) return 'loading';

      const allCardsLoaded = accountData.account.cardIds.every((id) =>
        loadedIds.includes(id),
      );
      const hasCards = accountData.cards.length > 0;

      if (!allCardsLoaded || !hasCards) return 'loading';

      return 'success';
    }),
    startWith('loading' as ViewState),
  );

  protected readonly cardsLabel$ = this.accountData$.pipe(
    map((data) => {
      if (!data)
        return {
          count: '0',
          key: 'my-products.card.account-cards.account-header.cardCountPlural',
        };
      const count = data.account.cardIds.length;
      return {
        count: `${count}`,
        key:
          count === 1
            ? 'my-products.card.account-cards.account-header.cardCount'
            : 'my-products.card.account-cards.account-header.cardCountPlural',
      };
    }),
  );

   ngOnInit(): void {
    this.store.dispatch(loadCardAccounts({}));

    this.store
      .select(selectAccountsLoaded)
      .pipe(
        filter((loaded) => loaded === true),
        take(1),
        takeUntilDestroyed(this.destroyRef), 
        tap(() => {
          this.store.dispatch(
            loadAccountCardsPage({ accountId: this.accountId }),
          );
        }),
      )
      .subscribe();
  }

 public handleCardClick(cardId: string): void {
    this.accountData$
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef), 
        tap((data) => {
          if (data) {
            const index = data.account.cardIds.indexOf(cardId);
            this.store.dispatch(
              setCurrentCardIndex({
                cardIndex: index,
                accountId: this.accountId,
              }),
            );
          }
        }),
      )
      .subscribe();

    this.router.navigate(['/bank/products/cards/details', cardId]);
  }

  public handleBackClick(): void {
    this.router.navigate(['/bank/products/cards/list']);
  }

  public handleRetry(): void {
    this.store.dispatch(loadAccountCardsPage({ accountId: this.accountId }));
  }
}
