import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  combineLatest,
  map,
  switchMap,
  of,
  tap,
  take,
  filter,
  startWith,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  loadCardDetails,
  loadCardAccounts,
  openCardDetailsModal,
  closeCardDetailsModal,
  navigateToNextCard,
  navigateToPreviousCard,
  setCurrentCardIndex,
  loadAccountCardsPage,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
  selectAccountById,
  selectIsCardDetailsModalOpen,
  selectCurrentCardIndex,
  selectCurrentAccountCardIds,
  selectAllAccounts,
  selectIsCardDetailLoaded,
  selectIsCardImageLoaded,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { CardImage } from '../components/card-image/card-image';
import { CardInfoSection } from '../components/card-info-section/card-info-section';
import { QuickActionsSection } from '../components/quick-actions-section/quick-actions-section';
import { CardViewData } from '../../../models/card-view-data.model';
import { TranslatePipe } from '@ngx-translate/core';
import { CardDetailsModal } from '../../card-details-modal/container/card-details-modal/card-details-modal';
import { PillPaging } from '@tia/shared/ui/pill-paging/pill-paging';
import { AlertService } from '@tia/core/services/alert/alert.service';


@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.html',
  styleUrls: ['./card-details.scss'],
  imports: [
    CommonModule,
    ButtonComponent,
    BasicCard,
    ErrorStates,
    CardImage,
    CardInfoSection,
    QuickActionsSection,
    TranslatePipe,
    CardDetailsModal,
    PillPaging,
    RouteLoader
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetails implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly alertService = inject(AlertService);
  private readonly cardId$ = this.route.paramMap.pipe(
    map((params) => params.get('cardId') || ''),
  );

  protected readonly error$ = this.store.select(selectCardDetailsError);
  protected readonly isDetailsModalOpen$ = this.store.select(
    selectIsCardDetailsModalOpen,
  );
  protected readonly currentCardIndex$ = this.store.select(
    selectCurrentCardIndex,
  );
  protected readonly currentAccountCardIds$ = this.store.select(
    selectCurrentAccountCardIds,
  );

  protected readonly cardData$ = combineLatest([
    this.cardId$,
    this.store.select(selectCardDetails),
    this.store.select(selectCardImages),
  ]).pipe(
    switchMap(([cardId, details, images]) => {
      const detail = details[cardId];
      const image = images[cardId];

      if (!detail || !image) return of(null);

      if (detail.accountId) {
        return this.store.select(selectAccountById(detail.accountId)).pipe(
          map(
            (account): CardViewData => ({
              cardId: cardId,
              details: detail,
              imageBase64: image,
              account,
              currency: account?.currency ?? 'N/A',
              formattedBalance: account
                ? `${account.currency} ${account.balance.toLocaleString()}`
                : 'N/A',
              shouldShowCreditLimit:
                detail.type === 'CREDIT' && !!detail.creditLimit,
              formattedCreditLimit:
                account && detail.creditLimit
                  ? `${account.currency} ${detail.creditLimit.toLocaleString()}`
                  : 'N/A',
              isActiveStatus: detail.status === 'ACTIVE',
            }),
          ),
        );
      }

      return of(null);
    }),
  );

  ngOnInit(): void {
    this.cardId$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((cardId) => this.loadCardData(cardId)),
      )
      .subscribe();
  }

  protected handleBack(): void {
    combineLatest([this.cardData$, this.store.select(selectAllAccounts)])
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap(([cardData, accounts]) => {
          if (!cardData?.details.accountId) {
            this.router.navigate(['/bank/products/cards']);
            return;
          }

          const account = accounts.find(
            (acc) => acc.id === cardData.details.accountId,
          );
          const hasMultipleCards = (account?.cardIds.length || 0) > 1;

          if (hasMultipleCards) {
            this.router.navigate([
              '/bank/products/cards/account',
              cardData.details.accountId,
            ]);
          } else {
            this.router.navigate(['/bank/products/cards']);
          }
        }),
      )
      .subscribe();
  }

  protected handleViewTransactions(): void {
    this.cardId$
      .pipe(
        take(1),
        tap((cardId) =>
          this.router.navigate(['/bank/products/cards/transactions', cardId]),
        ),
      )
      .subscribe();
  }

  protected handleRetry(): void {
    this.cardId$
      .pipe(
        take(1),
        tap((cardId) => this.loadCardData(cardId)),
      )
      .subscribe();
  }

  protected handleOpenDetailsModal(): void {
    this.cardId$
      .pipe(
        take(1),
        tap((cardId) => this.store.dispatch(openCardDetailsModal({ cardId }))),
      )
      .subscribe();
  }

  protected handleCloseDetailsModal(): void {
    this.store.dispatch(closeCardDetailsModal());
  }
  private loadCardData(cardId: string): void {
    this.store.dispatch(loadCardAccounts({}));
    this.store.dispatch(loadCardDetails({ cardId }));

    this.store
      .select(selectCardDetails)
      .pipe(
        map((details) => details[cardId]),
        filter((detail) => !!detail?.accountId),
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap((detail) => {
          this.store.dispatch(
            loadAccountCardsPage({ accountId: detail.accountId }),
          );
          this.setCurrentIndexAfterLoad(cardId, detail.accountId);
        }),
      )
      .subscribe();
  }

  private setCurrentIndexAfterLoad(cardId: string, accountId: string): void {
    this.store
      .select(selectAllAccounts)
      .pipe(
        map((accounts) => accounts.find((a) => a.id === accountId)),
        filter((account) => !!account && account.cardIds.length > 0),
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap((account) => {
          const index = account!.cardIds.indexOf(cardId);
          this.store.dispatch(
            setCurrentCardIndex({ cardIndex: index, accountId }),
          );
        }),
      )
      .subscribe();
  }

  protected readonly hasMultipleCards$ = combineLatest([
    this.cardData$,
    this.store.select(selectAllAccounts),
  ]).pipe(
    map(([cardData, accounts]) => {
      if (!cardData?.details.accountId) return false;
      const account = accounts.find(
        (acc) => acc.id === cardData.details.accountId,
      );
      return (account?.cardIds.length || 0) > 1;
    }),
  );

  protected handleGoToCard(index: number): void {
    combineLatest([this.currentAccountCardIds$, this.cardData$])
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap(([cardIds, cardData]) => {
          const targetCardId = cardIds[index];
          if (targetCardId && cardData?.details.accountId) {
            this.store.dispatch(
              setCurrentCardIndex({
                cardIndex: index,
                accountId: cardData.details.accountId,
              }),
            );
            this.router.navigate([
              '/bank/products/cards/details',
              targetCardId,
            ]);
          }
        }),
      )
      .subscribe();
  }

  protected handleNextCard(): void {
    this.store.dispatch(navigateToNextCard());

    combineLatest([this.currentCardIndex$, this.currentAccountCardIds$])
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap(([index, cardIds]) => {
          const nextCardId = cardIds[index];
          if (nextCardId) {
            this.router.navigate(['/bank/products/cards/details', nextCardId]);
          }
        }),
      )
      .subscribe();
  }

  protected handlePreviousCard(): void {
    this.store.dispatch(navigateToPreviousCard());

    combineLatest([this.currentCardIndex$, this.currentAccountCardIds$])
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        tap(([index, cardIds]) => {
          const previousCardId = cardIds[index];
          if (previousCardId) {
            this.router.navigate([
              '/bank/products/cards/details',
              previousCardId,
            ]);
          }
        }),
      )
      .subscribe();
  }

  protected readonly viewState$ = combineLatest([
    this.error$,
    this.cardData$,
  ]).pipe(
    map(([error, data]) => ({
      error,
      data,
    })),
  );

  protected readonly isInitialLoading$ = combineLatest([
  this.cardData$,
  this.store.select(selectCardDetailsLoading),
]).pipe(
  map(([data, loading]) => loading || !data)
);
}
