import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  untracked,
} from '@angular/core';
import {
  selectAccounts,
  selectError,
  selectIsLoading,
  selectSelectedAccount,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { TransfersAccountCard } from 'apps/tia-frontend/src/app/features/bank/transfers/ui/account-card/transfers-account-card';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountData } from 'apps/tia-frontend/src/app/features/bank/transfers/models/transfers.state.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

import { Router } from '@angular/router';
import { TransferInternalService } from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { DisabledReason } from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/models/transfers.internal.model';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-internal-from-account',
  imports: [
    TransfersAccountCard,
    TranslatePipe,
    ErrorStates,
    RouteLoader,
    ButtonComponent,
  ],
  templateUrl: './internal-from-account.html',
  styleUrl: './internal-from-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalFromAccount implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly store = inject(Store);
  private readonly breakpointService = inject(BreakpointService);
  private readonly router = inject(Router);
  private readonly transferInternalService = inject(TransferInternalService);
  private readonly alertService = inject(AlertService);
  private readonly translate = inject(TranslateService);

  public readonly isFullWidth = computed(() =>
    this.breakpointService.isMobile(),
  );

  private readonly rawAccounts = toSignal(this.store.select(selectAccounts), {
    initialValue: [],
  });

  public readonly accounts = computed(() => {
    const allAccounts = this.rawAccounts() || [];
    return [...allAccounts].sort(
      (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0),
    );
  });

  public readonly isLoading = toSignal(this.store.select(selectIsLoading), {
    initialValue: false,
  });

  public readonly error = toSignal(this.store.select(selectError), {
    initialValue: null,
  });

  public readonly preSelectedAccount = toSignal(
    this.store.select(selectSelectedAccount),
    { initialValue: null },
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

  public readonly selectedFromAccount = computed(() =>
    this.transferStore.senderAccount(),
  );

  public readonly isContinueDisabled = computed(() => {
    return !this.selectedFromAccount();
  });

  constructor() {
    effect(() => {
      const error = this.transferError();
      if (error && this.hasRepeatError()) {
        untracked(() => {
          this.alertService.error(this.translate.instant(error));
          this.transferStore.setError('');
        });
      }
    });

    effect(() => {
      const preSelected = this.preSelectedAccount();
      const currentSender = this.selectedFromAccount();

      if (!preSelected || currentSender) return;

      untracked(() => {
        if (this.isAccountDisabled(preSelected)) {
          this.store.dispatch(AccountsActions.selectAccount({ account: null }));
          return;
        }

        this.transferStore.setSenderAccount(preSelected);
        this.store.dispatch(AccountsActions.selectAccount({ account: null }));
      });
    });

    effect(() => {
      const accs = this.accounts();
      const currentSender = this.selectedFromAccount();
      const preSelected = this.preSelectedAccount();

      if (currentSender || preSelected || !accs.length) return;

      untracked(() => {
        const favoriteAccount = accs.find((acc) => acc.isFavorite);

        if (favoriteAccount && !this.isAccountDisabled(favoriteAccount)) {
          this.transferStore.setSenderAccount(favoriteAccount);
        }
      });
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
      this.selectedFromAccount(),
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
