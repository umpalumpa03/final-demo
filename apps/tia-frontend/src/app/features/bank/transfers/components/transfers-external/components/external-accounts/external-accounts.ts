import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  computed,
  OnInit,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransferStore } from '../../../../store/transfers.store';
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
import { Router } from '@angular/router';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-external-accounts',
  imports: [
    ButtonComponent,
    TranslatePipe,
    VerifiedUserCard,
    TransfersAccountCard,
    ErrorStates,
    Spinner,
    TextInput,
    ReactiveFormsModule,
    RouteLoader,
    Tooltip,
  ],
  templateUrl: './external-accounts.html',
  styleUrl: './external-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAccounts implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly recipientService = inject(TransferRecipientService);
  private readonly accountSelectionService = inject(
    TransferAccountSelectionService,
  );
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  public readonly hasFetchError = computed(() => {
    const error = this.transferStore.error();
    return (
      error === 'transfers.repeat.recipientNotFound' ||
      error === 'transfers.repeat.recipientAccountNotFound'
    );
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
    { initialValue: [] },
  );

  public readonly senderAccounts = computed(() => {
    const accounts = this.rawSenderAccounts() || [];
    return [...accounts].sort(
      (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0),
    );
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
  private readonly recipientNameStatus = toSignal(
    this.recipientNameInput.statusChanges,
    { initialValue: this.recipientNameInput.status },
  );

  public readonly recipientNameConfig = computed(() => ({
    label: this.translate.instant(
      'transfers.external.accounts.recipientName.label',
    ),
    placeholder: this.translate.instant(
      'transfers.external.accounts.recipientName.placeholder',
    ),
  }));

  public readonly recipientName = computed(() => {
    if (this.isExternalIban()) return this.transferStore.recipientInput();
    return this.transferStore.recipientInfo()?.fullName || '';
  });

  public readonly recipientAccounts = computed(() => {
    const info = this.transferStore.recipientInfo();
    if (!info) return [];
    let accounts: RecipientAccount[] = info.accounts
      ? [...info.accounts]
      : info.currency
        ? [
            {
              id: 'iban-recipient',
              iban: this.transferStore.recipientInput(),
              currency: info.currency,
            },
          ]
        : [];
    return accounts.sort(
      (a, b) =>
        ((b as Account).isFavorite ? 1 : 0) -
        ((a as Account).isFavorite ? 1 : 0),
    );
  });

  public readonly allSenderAccountsDisabled = computed(() => {
    const accounts = this.senderAccounts();
    if (accounts.length === 0) return false;

    return accounts.every((account) =>
      this.recipientService.isSenderAccountDisabled(
        account,
        this.selectedRecipientAccount(),
        this.isExternalIban(),
      ),
    );
  });

  public readonly isContinueDisabled = computed(() => {
    const isNameInvalid =
      this.isExternalIban() && this.recipientNameStatus() !== 'VALID';
    return (
      !this.selectedSenderAccount() ||
      this.isLoading() ||
      (!this.selectedRecipientAccount() && !this.isExternalIban()) ||
      isNameInvalid
    );
  });

  constructor() {
    this.initFeedbackEffects();
    this.accountSelectionService.initAutoSelectionLogic(
      this.senderAccounts,
      this.recipientAccounts,
      this.isExternalIban,
      this.preSelectedAccount,
      () =>
        this.alertService.warning(
          this.translate.instant(
            'transfers.external.accounts.currencyMismatch',
          ),
        ),
    );
  }

  private initFeedbackEffects(): void {
    effect(() => {
      if (this.transferStore.isVerified()) {
        untracked(() => {
          this.alertService.success(
            this.translate.instant(
              'transfers.external.accounts.recipientVerified',
            ),
          );
          this.transferStore.setIsVerified(false);
        });
      }
    });

    effect(() => {
      const error = this.transferStore.error();
      if (
        error === 'transfers.external.accounts.senderNotFound' ||
        error === 'transfers.external.accounts.noPermission' ||
        error === 'transfers.repeat.senderNotFound' ||
        error === 'transfers.repeat.senderNoPermission'
      ) {
        untracked(() => {
          this.alertService.error(this.translate.instant(error));
          this.transferStore.setError('');
        });
      }
    });

    effect(() => {
      if (this.allSenderAccountsDisabled()) {
        untracked(() => {
          this.alertService.warning(
            this.translate.instant(
              'transfers.external.accounts.allAccountsDisabled',
            ),
          );
        });
      }
    });
  }

  public ngOnInit(): void {
    const savedName = this.transferStore.manualRecipientName();
    if (savedName && this.isExternalIban()) {
      this.recipientNameInput.setValue(savedName);
    }

    if (
      (!this.senderAccounts() || this.senderAccounts().length === 0) &&
      !this.isLoadingSenderAccounts()
    ) {
      this.store.dispatch(AccountsActions.loadAccounts({}));
    }
  }

  public getSenderDisabledReason(account: Account) {
    return this.recipientService.getDisabledReason(
      account,
      this.selectedRecipientAccount(),
      this.isExternalIban(),
    );
  }

  public isRecipientAccountDisabled(account: RecipientAccount): boolean {
    return this.recipientService.isRecipientAccountDisabled(
      account,
      this.selectedSenderAccount(),
    );
  }

  public isSenderAccountDisabled(account: Account): boolean {
    return this.recipientService.isSenderAccountDisabled(
      account,
      this.selectedRecipientAccount(),
      this.isExternalIban(),
    );
  }

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
    this.router.navigate(['/bank/transfers/external/recipient']);
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
