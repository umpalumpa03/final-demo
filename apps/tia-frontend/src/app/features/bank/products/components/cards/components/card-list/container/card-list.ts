import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { combineLatest } from 'rxjs';
import { loadCardAccounts } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardGroups,
  selectLoading,
  selectError,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CardGroup } from '@tia/shared/models/cards/card-group.model';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.scss'],
  imports: [AsyncPipe, Badges],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly vm$ = combineLatest({
    cardGroups: this.store.select(selectCardGroups),
    loading: this.store.select(selectLoading),
    error: this.store.select(selectError),
  });

  protected readonly activeCardIndex = signal<Record<string, number>>({});

  ngOnInit(): void {
    this.store.dispatch(loadCardAccounts());
  }

  public handleCardClick(
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

  public getCardIndex(accountId: string): number {
    return this.activeCardIndex()[accountId] ?? 0;
  }
}