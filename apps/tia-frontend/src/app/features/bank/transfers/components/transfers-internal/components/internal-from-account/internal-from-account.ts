import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { selectAccounts, selectError, selectIsLoading } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { Location } from '@angular/common';
import {
  TransferInternalService
} from 'apps/tia-frontend/src/app/features/bank/transfers/services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';

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
  private readonly location = inject(Location);
  private readonly breakpointService = inject(BreakpointService);
  private readonly router = inject(Router);
  private readonly transferInternalService = inject(TransferInternalService);

  public readonly showSuccess = signal(false);

  public readonly isFullWidth = computed(() =>
    this.breakpointService.isMobile()
  );

  public readonly accounts = toSignal(
    this.store.select(selectAccounts),
    { initialValue: [] }
  );

  public readonly transferableAccounts = computed(() => {
    const allAccounts = this.accounts();

    return allAccounts.filter(account =>
      account.permission && (account.permission & 1) === 1,
    );
  })

  public readonly isLoading = toSignal(
    this.store.select(selectIsLoading),
    {initialValue: false}
  );

  public readonly error = toSignal(
    this.store.select(selectError),
    { initialValue: null }
  );

  public readonly selectedFromAccount = computed(() => this.transferStore.senderAccount());

  public readonly isContinueDisabled = computed(() => {
    return !this.selectedFromAccount();
  });

  ngOnInit() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onAccountSelect(account: AccountData) {
    this.transferInternalService.handleFromAccountSelect(
      account as Account,
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
