import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  TransferInternalService
} from 'apps/tia-frontend/src/app/features/bank/transfers/services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { Store } from '@ngrx/store';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import { selectAccounts, selectIsLoading } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectError } from 'apps/tia-frontend/src/app/store/loans/loans.reducer';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AccountData } from 'apps/tia-frontend/src/app/features/bank/transfers/models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { Location } from '@angular/common';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import {
  TransfersAccountCard
} from 'apps/tia-frontend/src/app/features/bank/transfers/ui/account-card/transfers-account-card';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-internal-to-account',
  imports: [
    AlertTypesWithIcons,
    ButtonComponent,
    ErrorStates,
    RouteLoader,
    TransfersAccountCard,
    TranslatePipe
  ],
  templateUrl: './internal-to-account.html',
  styleUrl: './internal-to-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalToAccount {
  private readonly transferStore = inject(TransferStore);
  private readonly store = inject(Store);
  private readonly location = inject(Location);
  private readonly breakpointService = inject(BreakpointService);
  private readonly router = inject(Router);
  private readonly transferInternalService = inject(TransferInternalService);

  public readonly isFullWidth = computed(() => this.breakpointService.isMobile());
  public readonly accounts = toSignal(this.store.select(selectAccounts), { initialValue: [] });
  public readonly isLoading = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  public readonly error = toSignal(this.store.select(selectError), { initialValue: null });

  public readonly showSuccess = signal(false);
  public readonly selectedToAccount = computed(() => this.transferStore.receiverOwnAccount());
  public readonly selectedFromAccount = computed(() => this.transferStore.senderAccount());

  public readonly isContinueDisabled = computed(() => {
    return !this.selectedToAccount();
  })

  public readonly transferableAccounts = computed(() => {
    return this.accounts().filter(account => account.id !== this.selectedFromAccount()?.id)
  })

  ngOnInit() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onAccountSelect(account: AccountData) {
    this.transferInternalService.handleToAccountSelect(
      account as Account,
      this.selectedToAccount()
    );
  }

  public onRetry() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onGoBack(): void {
    this.location.back();
  }

  public onContinue() {
    if (this.isContinueDisabled()) {
      return;
    }
    this.router.navigate(['/bank/transfers/internal/amount'])
  }

}
