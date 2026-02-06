
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
  hideSuccessAlert,
  openCreateCardModal,
  closeCreateCardModal,
} from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardGroups,
  selectLoading,
  selectError,
  selectShowSuccessAlert,
  selectIsCreateModalOpen,
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

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.scss'],
  imports: [
    AsyncPipe,
    CreateCard,
    SimpleAlerts,
  RouteLoader,
    ErrorStates,
    CardGroupItem,
    AddCardButton,
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly loading$ = this.store.select(selectLoading);
  protected readonly error$ = this.store.select(selectError);
  protected readonly showSuccessAlert$ = this.store.select(selectShowSuccessAlert);
  protected readonly isModalOpen$ = this.store.select(selectIsCreateModalOpen);

  public readonly activeCardIndex = signal<Record<string, number>>({});

  protected readonly cardGroupsWithMeta$ = combineLatest([
    this.store.select(selectCardGroups),
    toObservable(this.activeCardIndex)
  ]).pipe(
    map(([groups, activeIndexMap]): CardGroupView[] => groups.map(group => ({
      ...group,
      cardCountLabel: `${group.cardImages.length} Card${group.cardImages.length !== 1 ? 's' : ''}`,
      activeIndex: activeIndexMap[group.account.id] ?? 0,
      cards: group.cardImages.map((cardImage, idx) => ({
        ...cardImage,
        cardAlt: `Card ending in ${cardImage.cardId.slice(-4)}`,
        isStacked: idx !== (activeIndexMap[group.account.id] ?? 0),
        isActive: idx === (activeIndexMap[group.account.id] ?? 0),
        zIndex: idx === (activeIndexMap[group.account.id] ?? 0) ? 100 : group.cardImages.length - idx,
        index: idx,
      })),
    })))
  );

  ngOnInit(): void {
    this.store.dispatch(loadCardAccounts());
  }

  public handleCardClick(data: { accountId: string; cardId: string; index: number; hasMultipleCards: boolean }): void {
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

  protected readonly viewData$ = combineLatest({
  loading: this.loading$,
  error: this.error$,
  groups: this.cardGroupsWithMeta$,
  isModalOpen: this.isModalOpen$,
  showSuccessAlert: this.showSuccessAlert$
});
}