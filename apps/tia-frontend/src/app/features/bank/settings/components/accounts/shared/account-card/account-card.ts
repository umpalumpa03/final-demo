import { Component, computed, input, output } from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-account-card',
  imports: [BasicCard, ButtonComponent, Badges],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
})
export class AccountCard {
  public isFavorite = input.required<boolean | null>();
  public isHidden = input.required<boolean | null>();
  public readonly badge = computed<string>(() => {
    if (this.isHidden()) return 'Hidden';
    if (this.isFavorite()) return 'Favorite';
    return '';
  });
  public accountName = input.required<string>();
  public accountType = input.required<string>()
  public clickFaforite = output<boolean | null>();
  public clickHideUnhide = output<boolean | null>();
  public clickFriendlyName = output<boolean>();

  public onFavoriteClick(): void {
    this.clickFaforite.emit(this.isFavorite());
  }

  public onHideUnhideClick(): void {
    this.clickHideUnhide.emit(this.isHidden());
  }

  public onFriendlyNameClick(): void {
    this.clickFriendlyName.emit(true);
  }
}
