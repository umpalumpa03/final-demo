import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { TransferInternalService } from 'apps/tia-frontend/src/app/features/bank/transfers/components/transfers-internal/services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { Store } from '@ngrx/store';
import { TransferStore } from 'apps/tia-frontend/src/app/features/bank/transfers/store/transfers.store';
import {
  selectAccounts,
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AccountData } from 'apps/tia-frontend/src/app/features/bank/transfers/models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { TransfersAccountCard } from 'apps/tia-frontend/src/app/features/bank/transfers/ui/account-card/transfers-account-card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-internal-to-account',
  imports: [
    ButtonComponent,
    ErrorStates,
    RouteLoader,
    TransfersAccountCard,
    TranslatePipe,
    Badges,
  ],
  templateUrl: './internal-to-account.html',
  styleUrl: './internal-to-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalToAccount {
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
  public readonly accounts = toSignal(this.store.select(selectAccounts), {
    initialValue: [],
  });
  public readonly isLoading = toSignal(this.store.select(selectIsLoading), {
    initialValue: false,
  });
  public readonly error = toSignal(this.store.select(selectError), {
    initialValue: null,
  });


  public readonly selectedToAccount = computed(() =>
    this.transferStore.receiverOwnAccount(),
  );
  public readonly selectedFromAccount = computed(() =>
    this.transferStore.senderAccount(),
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

  public readonly isContinueDisabled = computed(() => {
    return !this.selectedToAccount();
  });

  public readonly transferableAccounts = computed(() => {
    return this.accounts().filter(
      (account) => account.id !== this.selectedFromAccount()?.id,
    );
  });

  public readonly isSwapDisabled = computed(() => {
    const recipient = this.selectedToAccount();

    if (!recipient) {
      return true;
    }

    if (!recipient.permission || (recipient.permission & 1) !== 1) {
      return true;
    }

    return false;
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
      const transferableAccs = this.transferableAccounts();
      const currentRecipient = this.selectedToAccount();
      const fromAccount = this.selectedFromAccount();

      if (!fromAccount || currentRecipient || !transferableAccs.length) return;

      untracked(() => {
        const favoriteAccount = transferableAccs.find((acc) => acc.isFavorite);

        if (favoriteAccount) {
          this.transferStore.setReceiverOwnAccount(favoriteAccount);
        }
      });
    });
  }

  ngOnInit() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onAccountSelect(account: AccountData) {
    this.transferInternalService.handleToAccountSelect(
      account as Account,
      this.selectedToAccount(),
    );
  }

  public onRetry() {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onGoBack(): void {
    this.router.navigate(['/bank/transfers/internal/from-account']);
  }

  public onContinue() {
    if (this.isContinueDisabled()) {
      return;
    }
    this.router.navigate(['/bank/transfers/internal/amount']);
  }

  public getLastFourDigits(iban: string): string {
    return iban.slice(-4);
  }

  public onSwapAccounts() {
    const currentSender = this.selectedFromAccount();
    const currentRecipient = this.selectedToAccount();

    if (!currentSender || !currentRecipient) {
      return;
    }

    this.transferStore.setSenderAccount(currentRecipient as Account);
    this.transferStore.setReceiverOwnAccount(currentSender as Account);
  }
}
