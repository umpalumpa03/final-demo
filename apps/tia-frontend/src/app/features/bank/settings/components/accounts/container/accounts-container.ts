import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  effect,
  computed,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { finalize, switchMap, startWith } from 'rxjs';
import { AccountCard } from '../shared/account-card/account-card';
import { AccountManagementService } from '../services/acount-management.service';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { SettingsBody } from '../../../shared/ui/settings-body/settings-body';
import { IAccounts } from '../models/account.models';

@Component({
  selector: 'app-accounts-container',
  imports: [AccountCard, Skeleton, SettingsBody],
  templateUrl: './accounts-container.html',
  styleUrl: './accounts-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsContainer {
  private accountService = inject(AccountManagementService);

  public isLoading = this.accountService.isLoading;
  public accountsList = this.accountService.accountsList;
  private refreshTrigger = signal(0);

  constructor() {
    this.accountService.setRefreshCallback(() => this.triggerRefresh());
    effect(() => {
      this.refreshTrigger();
      this.loadAccounts();
    });
  }

  private loadAccounts(): void {
    this.accountService.getAllAcounts().subscribe();
  }

  private triggerRefresh(): void {
    this.refreshTrigger.update((val) => val + 1);
  }

  public handleFavorite(id: string, isFavorite: boolean | null): void {
    this.accountService.handleFavoriteStatus(id, isFavorite).subscribe();
  }

  public handleVisibility(id: string, isHidden: boolean | null): void {
    this.accountService.handleAccountVisibility(id, isHidden).subscribe();
  }

  public handleFriendlyName(id: string): void {
    void id;
  }
}
