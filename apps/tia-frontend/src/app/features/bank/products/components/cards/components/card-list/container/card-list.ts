
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import {
  loadCardAccounts,

  openCreateCardModal,
  closeCreateCardModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardGroups,
  selectLoading,
  selectError,
  
  selectIsCreateModalOpen,
  selectCardImagesLoading,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { CreateCard } from '../../create-card-modal/container/createCard';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { AsyncPipe } from '@angular/common';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { toObservable } from '@angular/core/rxjs-interop';
import { CardGroupView } from '../models/card-list-view.model';
import { CardGroupItem } from '../components/card-group-item/card-group-item';
import { AddCardButton } from '../components/add-card-button/add-card-button';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { TranslatePipe } from '@ngx-translate/core';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { CardGroup } from '../../../models/card-group.model';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.scss'],
  imports: [
    AsyncPipe,
    CreateCard,
    RouteLoader,
    ErrorStates,
    CardGroupItem,
    AddCardButton,
    TranslatePipe,
    Skeleton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly loading$ = this.store.select(selectLoading);
  protected readonly error$ = this.store.select(selectError);

  protected readonly isModalOpen$ = this.store.select(selectIsCreateModalOpen);
  protected readonly cardImagesLoading$ = this.store.select(
    selectCardImagesLoading,
  );
  public readonly activeCardIndex = signal<Record<string, number>>({});
protected readonly alertService = inject(AlertService);
  public readonly cardGroupsWithMeta$ = combineLatest([
    this.store.select(selectCardGroups),
    toObservable(this.activeCardIndex),
  ]).pipe(
    map(([groups, activeIndexMap]) =>
      this.transformCardGroups(groups, activeIndexMap)
    )
  );

  public transformCardGroups(
    groups: CardGroup[],
    activeIndexMap: Record<string, number>
  ): CardGroupView[] {
    return groups.map((group) => ({
      ...group,
      cardCountLabel: `${group.cardImages.length}`,
      cardCountKey:
        group.cardImages.length === 1
          ? 'my-products.card.card-list.card-group-item.cardCount'
          : 'my-products.card.card-list.card-group-item.cardCountPlural',
      activeIndex: activeIndexMap[group.account.id] ?? 0,
      cards: group.cardImages.map((cardImage, idx) => {
        const activeIdx = activeIndexMap[group.account.id] ?? 0;
        const isActive = idx === activeIdx;
        const stackPosition = this.calculateStackPosition(idx, activeIdx, isActive);

        return {
          ...cardImage,
          cardAlt: `Card ending in ${cardImage.cardId.slice(-4)}`,
          isStacked: !isActive,
          isActive: isActive,
          zIndex: isActive ? 40 : group.cardImages.length - idx,
          index: idx,
          stackPosition: stackPosition,
        };
      }),
    }));
  }

  private calculateStackPosition(
    idx: number,
    activeIdx: number,
    isActive: boolean
  ): number {
    if (isActive) {
      return 0;
    }
    return idx < activeIdx ? idx + 1 : idx;
  }


  ngOnInit(): void {
  this.store.dispatch(loadCardAccounts({ forceRefresh: false }));
}


  public handleCardClick(data: {
    accountId: string;
    cardId: string;
    index: number;
    hasMultipleCards: boolean;
  }): void {
    if (!data.hasMultipleCards) {
      this.router.navigate(['/bank/products/cards/details', data.cardId]);
    } else {
      const currentIndex = this.activeCardIndex()[data.accountId] ?? 0;

      if (data.index === currentIndex) {
        this.router.navigate(['/bank/products/cards/account', data.accountId]);
      } else {
        this.activeCardIndex.update((state) => ({
          ...state,
          [data.accountId]: data.index,
        }));
      }
    }
  }

  public handleViewAllCards(data: { accountId: string }): void {
    this.router.navigate(['/bank/products/cards/account', data.accountId]);
  }

  public handleOpenModal(): void {
    this.store.dispatch(openCreateCardModal());
  }

  public handleCloseModal(): void {
    this.store.dispatch(closeCreateCardModal());
  }

  public readonly viewData$ = combineLatest({
    loading: this.loading$,
    error: this.error$,
    groups: this.cardGroupsWithMeta$,
    isModalOpen: this.isModalOpen$,
    cardImagesLoading: this.cardImagesLoading$,
  });
}