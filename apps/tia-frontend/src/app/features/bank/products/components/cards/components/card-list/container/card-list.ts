
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  effect,
  untracked,
  computed,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
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
import { CardGroup } from '@tia/shared/models/cards/card-group.model';
import { CreateCard } from '../../create-card-modal/container/createCard';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.scss'],
  imports: [Badges, CreateCard, SimpleAlerts, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly cardGroups = this.store.selectSignal(selectCardGroups);
  protected readonly loading = this.store.selectSignal(selectLoading);
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly showSuccessAlert = this.store.selectSignal(
    selectShowSuccessAlert,
  );
  protected readonly isModalOpen = this.store.selectSignal(
    selectIsCreateModalOpen,
  );

  protected readonly activeCardIndex = signal<Record<string, number>>({});

  constructor() {
    effect(() => {
      if (this.showSuccessAlert()) {
        untracked(() => {
          setTimeout(() => {
            this.store.dispatch(hideSuccessAlert());
          }, 5000);
        });
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadCardAccounts());
  }

  protected handleCardClick(
    group: CardGroup,
    cardId: string,
    cardIndex: number,
  ): void {
    if (group.cardImages.length === 1) {
      this.router.navigate(['/bank/products/cards/details', cardId]);
    } else {
      const currentIndex = this.activeCardIndex()[group.account.id] ?? 0;

      if (cardIndex === currentIndex) {
        this.router.navigate([
          '/bank/products/cards/account',
          group.account.id,
        ]);
      } else {
        this.activeCardIndex.update((state) => ({
          ...state,
          [group.account.id]: cardIndex,
        }));
      }
    }
  }

  protected handleViewAllCards(accountId: string): void {
    this.router.navigate(['/bank/products/cards/account', accountId]);
  }

  protected getCardIndex(accountId: string): number {
    return this.activeCardIndex()[accountId] ?? 0;
  }

  protected openModal(): void {
    this.store.dispatch(openCreateCardModal());
  }

  protected handleCloseModal(): void {
    this.store.dispatch(closeCreateCardModal());
  }

  protected getCardCountLabel(count: number): string {
    return `${count} Card${count !== 1 ? 's' : ''}`;
  }

  protected getCardAlt(cardId: string): string {
    return `Card ending in ${cardId.slice(-4)}`;
  }

  protected getStackedClass(accountId: string, index: number): boolean {
    return index !== this.getCardIndex(accountId);
  }

  protected getActiveClass(accountId: string, index: number): boolean {
    return index === this.getCardIndex(accountId);
  }

  protected getZIndex(group: CardGroup, index: number): number {
    return index === this.getCardIndex(group.account.id)
      ? 100
      : group.cardImages.length - index;
  }
}
