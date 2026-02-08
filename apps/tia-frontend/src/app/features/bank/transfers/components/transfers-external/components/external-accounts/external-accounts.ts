import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  computed,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransferStore } from '../../../../store/transfers.store';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { VerifiedUserCard } from '../../../../ui/verified-user-card/verified-user-card';
import { TransfersAccountCard } from '../../../../ui/account-card/transfers-account-card';
import {
  AccountData,
  RecipientAccount,
} from '../../../../models/transfers.state.model';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import {
  selectIsLoading,
  selectAccounts,
  selectError,
  selectSelectedAccount,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { TransferRecipientService } from '../../services/transfer-recipient.service';
import { TransferAccountSelectionService } from '../../services/transfer-account-selection.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';

@Component({
  selector: 'app-external-accounts',
  imports: [
    ButtonComponent,
    TranslatePipe,
    AlertTypesWithIcons,
    VerifiedUserCard,
    TransfersAccountCard,
    ErrorStates,
    Spinner,
    TextInput,
    ReactiveFormsModule,
    RouteLoader,
    Tooltip,
  ],
  providers: [],
  templateUrl: './external-accounts.html',
  styleUrl: './external-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAccounts implements OnInit {
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly recipientService = inject(TransferRecipientService);
  private readonly accountSelectionService = inject(
    TransferAccountSelectionService,
  );
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);

  public readonly showSuccess = signal(false);
  public readonly showError = signal(false);
  public readonly currencyMismatchError = signal(false);

  public readonly hasFetchError = computed(() => {
    const error = this.transferStore.error();
    return error && error !== 'transfers.external.accounts.noPermission';
  });

  public readonly isFullWidth = computed(() =>
    this.breakpointService.isMobile(),
  );
  public readonly selectedSenderAccount = computed(() =>
    this.transferStore.senderAccount(),
  );
  public readonly selectedRecipientAccount = computed(() =>
    this.transferStore.selectedRecipientAccount(),
  );

  private readonly rawSenderAccounts = toSignal(
    this.store.select(selectAccounts),
    {
      initialValue: [],
    },
  );

  public readonly senderAccounts = computed(() => {
    const accounts = this.rawSenderAccounts();
    if (!accounts) return [];
    return [...accounts].sort((a, b) => {
      const aFav = a.isFavorite ? 1 : 0;
      const bFav = b.isFavorite ? 1 : 0;
      return bFav - aFav;
    });
  });

  public readonly isLoadingSenderAccounts = toSignal(
    this.store.select(selectIsLoading),
    { initialValue: false },
  );
  public readonly senderAccountsError = toSignal(
    this.store.select(selectError),
    { initialValue: null },
  );
  public readonly preSelectedAccount = toSignal(
    this.store.select(selectSelectedAccount),
    { initialValue: null },
  );

  public readonly isLoading = computed(() => this.transferStore.isLoading());
  public readonly error = computed(() => this.transferStore.error());

  public readonly isExternalIban = computed(
    () => this.transferStore.recipientType() === 'iban-different-bank',
  );

  public readonly recipientNameInput = this.fb.control('', [
    Validators.required,
  ]);

  public readonly recipientNameConfig = computed(() => ({
    label: this.translate.instant(
      'transfers.external.accounts.recipientName.label',
    ),
    placeholder: this.translate.instant(
      'transfers.external.accounts.recipientName.placeholder',
    ),
  }));

  public readonly recipientName = computed(() => {
    if (this.isExternalIban()) {
      return this.transferStore.recipientInput();
    }
    return this.transferStore.recipientInfo()?.fullName || '';
  });

  public readonly recipientAccounts = computed(() => {
    const info = this.transferStore.recipientInfo();
    if (!info) return [];

    let accounts: RecipientAccount[] = [];

    if (info.accounts) {
      accounts = [...info.accounts];
    } else if (info.currency) {
      accounts = [
        {
          id: 'iban-recipient',
          iban: this.transferStore.recipientInput(),
          currency: info.currency,
        },
      ];
    }
    return accounts.sort((a, b) => {
      const aFav = (a as Account).isFavorite ? 1 : 0;
      const bFav = (b as Account).isFavorite ? 1 : 0;
      return bFav - aFav;
    });
  });

  private readonly recipientNameStatus = toSignal(
    this.recipientNameInput.statusChanges,
    { initialValue: this.recipientNameInput.status },
  );

  constructor() {
    effect(() => {
      const isVerified = this.transferStore.isVerified();
      if (isVerified) {
        untracked(() => {
          this.showSuccess.set(true);
          this.transferStore.setIsVerified(false);
        });
        const timeout = setTimeout(() => {
          this.showSuccess.set(false);
        }, 3000);

        return () => clearTimeout(timeout);
      }
      return;
    });
    effect(() => {
      const mismatch = this.currencyMismatchError();
      if (mismatch) {
        const timeout = setTimeout(() => {
          this.currencyMismatchError.set(false);
        }, 5000);
        return () => clearTimeout(timeout);
      }
      return;
    });

    effect(() => {
      const error = this.transferStore.error();
      if (error === 'transfers.external.accounts.noPermission') {
        untracked(() => {
          this.showError.set(true);
        });
        const timeout = setTimeout(() => {
          this.showError.set(false);
          this.transferStore.setError('');
        }, 5000);

        return () => clearTimeout(timeout);
      }
      return;
    });

    effect(() => {
      const preSelected = this.preSelectedAccount();
      const currentSender = this.selectedSenderAccount();
      const recipientAccount = this.selectedRecipientAccount();
      const isExternal = this.isExternalIban();

      if (!preSelected) return;
      if (currentSender) return;

      untracked(() => {
        if (isExternal) {
          this.store.dispatch(AccountsActions.selectAccount({ account: null }));
          return;
        }
        if (
          recipientAccount &&
          preSelected.currency !== recipientAccount.currency
        ) {
          this.currencyMismatchError.set(true);
          this.store.dispatch(AccountsActions.selectAccount({ account: null }));
          return;
        }

        this.currencyMismatchError.set(false);
        this.transferStore.setSenderAccount(preSelected);
        this.store.dispatch(AccountsActions.selectAccount({ account: null }));
      });
    });

    effect(() => {
      const sAccounts = this.senderAccounts();
      const rAccounts = this.recipientAccounts();
      const currentSender = this.selectedSenderAccount();
      const currentRecipient = this.selectedRecipientAccount();
      const isExternal = this.isExternalIban();

      untracked(() => {
        if (!isExternal && rAccounts.length > 0 && !currentRecipient) {
          const firstRecipient = rAccounts[0];
          if ((firstRecipient as Account).isFavorite) {
            this.transferStore.setSelectedRecipientAccount(firstRecipient);
          }
        }

        if (sAccounts.length > 0 && !currentSender) {
          const firstSender = sAccounts[0];
          const updatedRecipient = this.selectedRecipientAccount();

          const isFav = firstSender.isFavorite;
          const isDisabled = this.recipientService.isSenderAccountDisabled(
            firstSender,
            updatedRecipient,
            isExternal,
          );

          if (isFav && !isDisabled) {
            this.transferStore.setSenderAccount(firstSender);
          }
        }
      });
    });
  }

  public ngOnInit(): void {
    const accounts = this.senderAccounts();
    const isLoading = this.isLoadingSenderAccounts();

    if ((!accounts || accounts.length === 0) && !isLoading) {
      this.store.dispatch(AccountsActions.loadAccounts({}));
    }
  }

  public readonly isContinueDisabled = computed(() => {
    const hasSender = !!this.selectedSenderAccount();
    const loading = this.isLoading();
    const isExternal = this.isExternalIban();
    const hasRecipient = !!this.selectedRecipientAccount();

    const isNameInvalid = isExternal && this.recipientNameStatus() !== 'VALID';

    return (
      !hasSender || loading || (!hasRecipient && !isExternal) || isNameInvalid
    );
  });

  public isRecipientAccountDisabled = (account: RecipientAccount): boolean => {
    return this.recipientService.isRecipientAccountDisabled(
      account,
      this.selectedSenderAccount(),
    );
  };

  public isSenderAccountDisabled = (account: Account): boolean => {
    return this.recipientService.isSenderAccountDisabled(
      account,
      this.selectedRecipientAccount(),
      this.isExternalIban(),
    );
  };

  public onRecipientAccountSelect(account: Account | RecipientAccount): void {
    this.accountSelectionService.handleRecipientAccountSelect(
      account as RecipientAccount,
      this.selectedRecipientAccount(),
    );
  }

  public onSenderAccountSelect(account: AccountData): void {
    this.accountSelectionService.handleSenderAccountSelect(
      account as Account,
      this.selectedSenderAccount(),
    );
  }

  public onRetrySenderAccounts(): void {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public onRetry(): void {
    this.recipientService.handleRetryRecipientLookup(
      this.transferStore.recipientInput(),
      this.transferStore.recipientType(),
    );
  }

  public onGoBack(): void {
    this.location.back();
  }

  public onContinue(): void {
    this.accountSelectionService.handleContinue(
      this.selectedRecipientAccount(),
      this.selectedSenderAccount(),
      this.isExternalIban(),
      this.recipientNameInput.value,
    );
  }
}
