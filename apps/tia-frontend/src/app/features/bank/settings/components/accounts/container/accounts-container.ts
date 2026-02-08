import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AccountCard } from '../shared/ui/account-card/account-card';
import { AccountsStore } from '../strore/accounts.store';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { Router } from '@angular/router';
import { ChangeName } from '../components/change-name/change-name';
import { ScrollArea } from "@tia/shared/lib/layout/components/scroll-area/container/scroll-area";
import { TranslatePipe } from '@ngx-translate/core';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { ERROR_STATE } from '../config/accounts.config';

@Component({
  selector: 'app-accounts-container',
  imports: [AccountCard, Skeleton, SettingsBody, ErrorStates, ChangeName, ScrollArea, TranslatePipe, DismissibleAlerts],
  providers: [AccountsStore],
  templateUrl: './accounts-container.html',
  styleUrl: './accounts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsContainer implements OnInit {
  public readonly store = inject(AccountsStore);
  public readonly router = inject(Router);
  public readonly changeNameOpen = signal<boolean>(false);
  public readonly changeNameAccountId = signal<string | null>(null);
  public readonly changeNameInitial = signal<string>('');
  public readonly changeNameAccountNumber = signal<string | null>(null);
  public readonly errorState = ERROR_STATE;

  public ngOnInit(): void {
    this.store.loadAccounts();
  }

  public isFavoriteLoading(id: string): boolean {
    return this.store.favoriteLoadingIds().has(id);
  }

  public isVisibilityLoading(id: string): boolean {
    return this.store.visibilityLoadingIds().has(id);
  }

  public isChangeNameLoading(id: string): boolean {
    return this.store.changeNameLoadingIds().has(id);
  }

  public handleFavorite(id: string, isFavorite: boolean | null): void {
    this.store.toggleFavorite({ id, isFavorite });
  }

  public handleVisibility(id: string, isHidden: boolean | null): void {
    this.store.toggleVisibility({ id, isHidden });
  }
  public openChangeName(
    id: string,
    friendlyName: string,
    accountNumber?: string | null,
  ): void {
    this.changeNameAccountId.set(id);
    this.changeNameInitial.set(friendlyName);
    this.changeNameAccountNumber.set(accountNumber ?? null);
    this.changeNameOpen.set(true);
  }

  public closeChangeName(): void {
    this.changeNameOpen.set(false);
    this.changeNameAccountId.set(null);
    this.changeNameInitial.set('');
  }

  public submitChangeName(friendlyName: string): void {
    const id = this.changeNameAccountId();
    if (id) {
      this.store.changeFriendlyName({ id, friendlyName });
    }
    this.closeChangeName();
  }

  public backButtonClick() {
    this.router.navigate(['bank/dashboard']);
  }

  public failRetryClick() {
    this.store.loadAccounts();
  }
}
