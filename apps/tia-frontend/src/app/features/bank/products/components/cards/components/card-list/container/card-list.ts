import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  effect,
  untracked,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map } from 'rxjs';
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
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CreateCard } from '../../create-card-modal/container/createCard';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.scss'],
  imports: [Badges, AsyncPipe,CreateCard, SimpleAlerts, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly cardGroups$ = this.store.select(selectCardGroups);
  protected readonly loading$ = this.store.select(selectLoading);
  protected readonly error$ = this.store.select(selectError);
  protected readonly showSuccessAlert$ = this.store.select(selectShowSuccessAlert);
  protected readonly isModalOpen$ = this.store.select(selectIsCreateModalOpen);

  protected readonly activeCardIndex = signal<Record<string, number>>({});

  protected readonly cardGroupsWithMeta$ = this.cardGroups$.pipe(
    map(groups => groups.map(group => ({
      ...group,
      cardCountLabel: `${group.cardImages.length} Card${group.cardImages.length !== 1 ? 's' : ''}`,
      activeIndex: this.activeCardIndex()[group.account.id] ?? 0,
      cards: group.cardImages.map((cardImage, idx) => ({
        ...cardImage,
        cardAlt: `Card ending in ${cardImage.cardId.slice(-4)}`,
        isStacked: idx !== (this.activeCardIndex()[group.account.id] ?? 0),
        isActive: idx === (this.activeCardIndex()[group.account.id] ?? 0),
        zIndex: idx === (this.activeCardIndex()[group.account.id] ?? 0) 
          ? 100 
          : group.cardImages.length - idx,
        index: idx,
      })),
    })))
  );

  constructor() {
    effect(() => {
      this.store.select(selectShowSuccessAlert).subscribe(show => {
        if (show) {
          untracked(() => {
            setTimeout(() => {
              this.store.dispatch(hideSuccessAlert());
            }, 5000);
          });
        }
      });
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadCardAccounts());
  }

  protected handleCardClick(accountId: string, cardId: string, cardIndex: number, hasMultipleCards: boolean): void {
    if (!hasMultipleCards) {
      this.router.navigate(['/bank/products/cards/details', cardId]);
    } else {
      const currentIndex = this.activeCardIndex()[accountId] ?? 0;

      if (cardIndex === currentIndex) {
        this.router.navigate(['/bank/products/cards/account', accountId]);
      } else {
        this.activeCardIndex.update((state) => ({
          ...state,
          [accountId]: cardIndex,
        }));
      }
    }
  }

  protected handleViewAllCards(accountId: string): void {
    this.router.navigate(['/bank/products/cards/account', accountId]);
  }

  protected openModal(): void {
    this.store.dispatch(openCreateCardModal());
  }

  protected handleCloseModal(): void {
    this.store.dispatch(closeCreateCardModal());
  }
}