import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { AccountUtils } from '@tia/shared/utils/accounts-icons/account.utils';
import { AccountType } from '@tia/shared/models/accounts/accounts.model';
import { TranslatePipe } from '@ngx-translate/core';
import { ACCOUNT_ACTIONS } from '../../../config/accounts.config';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';

@Component({
  selector: 'app-account-card',
  imports: [BasicCard, ButtonComponent, Badges, TranslatePipe],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCard {
  private readonly accountUtils = new AccountUtils();
  private readonly breakpointService = inject(BreakpointService);
  public readonly isXsMobile = this.breakpointService.isXsMobile;
  
  public readonly actions = ACCOUNT_ACTIONS;
  public isFavorite = input.required<boolean | null>();
  public isHidden = input.required<boolean | null>();
  public readonly badge = computed<string>(() => {
    if (this.isHidden()) return 'Hidden';
    if (this.isFavorite()) return 'Favorite';
    return '';
  });
  public name = input.required<string>();
  public type = input.required<AccountType>();
  public currency = input.required<string>();
  public balance = input.required<string>();
  public iban = input.required<string>();
  public isVisibilityLoading = input<boolean>(false);
  public isFavoriteLoading = input<boolean>(false);
  public isChangeNameLoading = input<boolean>(false);
  public clickFaforite = output<boolean | null>();
  public clickHideUnhide = output<boolean | null>();
  public clickFriendlyName = output<boolean>();

  protected accountIcon = computed(() =>
    this.accountUtils.getAccountIcon(this.type()),
  );

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
