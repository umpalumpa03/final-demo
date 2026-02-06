import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AccountCard } from '../shared/account-card/account-card';
import { AccountsStore } from '../strore/accounts.store';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';

@Component({
  selector: 'app-accounts-container',
  imports: [AccountCard, Skeleton, SettingsBody],
  providers: [AccountsStore],
  templateUrl: './accounts-container.html',
  styleUrl: './accounts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsContainer implements OnInit {
  readonly store = inject(AccountsStore);

  public ngOnInit(): void {
    this.store.loadAccounts();
  }

  public handleFavorite(id: string, isFavorite: boolean | null): void {
    this.store.toggleFavorite({ id, isFavorite });
  }

  public handleVisibility(id: string, isHidden: boolean | null): void {
    this.store.toggleVisibility({ id, isHidden });
  }

  public handleFriendlyName(id: string): void {
    void id;
  }
}
