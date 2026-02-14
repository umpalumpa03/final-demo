import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  AsyncPipe,
  DecimalPipe,
  NgClass,
} from '@angular/common';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { map } from 'rxjs';
import { BaseWidget } from '../shared/base-widget.config';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { CurrencySymbolPipe } from 'apps/tia-frontend/src/app/features/bank/dashboard/pipes/currency-symbols.pipe';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectDashboardAccountsWithTrendline
} from 'apps/tia-frontend/src/app/features/bank/dashboard/selectors/dashboard-accounts.selectors';

@Component({
  selector: 'app-widget-accounts',
  imports: [
    AsyncPipe,
    RouteLoader,
    ErrorStates,
    ScrollArea,
    CurrencySymbolPipe,
    DecimalPipe,
    TranslateModule,
    NgClass,
  ],
  templateUrl: './widget-accounts.html',
  styleUrl: './widget-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetAccounts extends BaseWidget {
  private readonly store = inject(Store);

  public balancesHidden = input<boolean>(false);

  public retryLoad(): void {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public accounts$ = this.store.select(selectDashboardAccountsWithTrendline);
  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public isEmpty$ = this.accounts$.pipe(
    map((accounts) => !accounts || accounts.length === 0),
  );

  public animatedBalances = signal<Record<string, number>>({});
  private animationFrames: Record<string, number> = {};

  constructor() {
    super();

    this.accounts$.subscribe((accounts) => {
      accounts.forEach((account) => {
        if (account.trendline) {
          this.animateBalance(account.id, 0, account.balance, 1000);
        } else {
          this.setAnimatedBalance(account.id, account.balance);
        }
      });
    });
  }

  private animateBalance(
    accountId: string,
    startValue: number,
    endValue: number,
    duration: number,
  ): void {
    if (this.animationFrames[accountId]) {
      cancelAnimationFrame(this.animationFrames[accountId]);
    }

    const startTime = performance.now();
    const range = endValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
      const easedProgress = easeOutQuint(progress);

      const currentValue = startValue + range * easedProgress;
      this.setAnimatedBalance(accountId, currentValue);

      if (progress < 1) {
        this.animationFrames[accountId] = requestAnimationFrame(animate);
      } else {
        delete this.animationFrames[accountId];
      }
    };

    this.animationFrames[accountId] = requestAnimationFrame(animate);
  }

  private setAnimatedBalance(accountId: string, value: number): void {
    this.animatedBalances.update((balances) => ({
      ...balances,
      [accountId]: value,
    }));
  }

  public getAnimatedBalance(accountId: string): number {
    return this.animatedBalances()[accountId] ?? 0;
  }

  public formatAsAsterisks(value: number): string {
    return '******';
  }
}
