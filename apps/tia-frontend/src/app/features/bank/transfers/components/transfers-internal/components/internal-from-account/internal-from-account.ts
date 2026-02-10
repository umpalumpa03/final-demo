import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { selectAccounts, selectError, selectIsLoading } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  TransfersAccountCard
} from 'apps/tia-frontend/src/app/features/bank/transfers/ui/account-card/transfers-account-card';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountData } from 'apps/tia-frontend/src/app/features/bank/transfers/models/transfers.state.model';
import { TranslatePipe } from '@ngx-translate/core';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';

import { Router } from '@angular/router';
import {
  TransferInternalService
} from 'apps/tia-frontend/src/app/features/bank/transfers/services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import {
  DisabledReason
} from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/models/transfers.internal.model';

@Component({
  selector: 'app-internal-from-account',
  imports: [
    TransfersAccountCard,
    TranslatePipe,
    ErrorStates,
    RouteLoader,
    ButtonComponent,
    AlertTypesWithIcons,
  ],
  templateUrl: './internal-from-account.html',
  styleUrl: './internal-from-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalFromAccount implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly store = inject(Store);
  private readonly breakpointService = inject(BreakpointService);
  private readonly router = inject(Router);
  private readonly transferInternalService = inject(TransferInternalService);

  public readonly showSuccess = signal(false);
  public readonly showError = signal(false);

  public readonly isFullWidth = computed(() =>
    this.breakpointService.isMobile()
  );

  private readonly rawAccounts = toSignal(
    this.store.select(selectAccounts),
    { initialValue: [] }
  );

  public readonly accounts = computed(() => {
    const allAccounts = this.rawAccounts() || [];
    return [...allAccounts].sort(
      (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
    );
  });

  public readonly isLoading = toSignal(
    this.store.select(selectIsLoading),
    {initialValue: false}
  );

  public readonly error = toSignal(
    this.store.select(selectError),
    { initialValue: null }
  );

  public readonly transferError = computed(() => this.transferStore.error());

  public readonly hasRepeatError = computed(() => {
    const error = this.transferError();
    return (
      error === 'transfers.repeat.senderNotFound' ||
      error === 'transfers.repeat.senderNoPermission' ||
      error === 'transfers.repeat.recipientAccountNotFound'
    );
  });

  public readonly selectedFromAccount = computed(() => this.transferStore.senderAccount());

  public readonly isContinueDisabled = computed(() => {
    return !this.selectedFromAccount();
  });

  constructor() {
    effect(() => {
      const error = this.transferError();
      if (error && this.hasRepeatError()) {
        this.showError.set(true);
        setTimeout(() => {
          this.showError.set(false);
          this.transferStore.setError('');
        }, 5000);
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public isAccountDisabled(account: Account): boolean {
    return !account.permission || (account.permission & 1) !== 1;
  }

  public getDisabledReason(account: Account): DisabledReason {
    if (this.isAccountDisabled(account)) {
      return 'PERMISSION_DENIED';
    }
    return null;
  }

  public onAccountSelect(account: AccountData) {
    const accountData = account as Account;

    if (this.isAccountDisabled(accountData)) {
      return;
    }

    this.transferInternalService.handleFromAccountSelect(
      accountData,
      this.selectedFromAccount()
    );
  }

  public onRetry() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onContinue() {
    if (this.isContinueDisabled()) {
      return;
    }
    this.router.navigate(['/bank/transfers/internal/to-account']);
  }
}
