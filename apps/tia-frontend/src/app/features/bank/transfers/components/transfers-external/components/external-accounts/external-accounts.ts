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
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { Tooltip } from "@tia/shared/lib/data-display/tooltip/tooltip";

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
    Tooltip
],
  providers: [],
  templateUrl: './external-accounts.html',
  styleUrl: './external-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAccounts implements OnInit {
  private readonly location = inject(Location);
  private readonly transferStore = inject(TransferStore);
  private readonly transferExternalService = inject(TransferExternalService);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  public readonly showSuccess = signal(false);
  public readonly isFullWidth = computed(() =>
    this.breakpointService.isMobile(),
  );
  public readonly selectedSenderAccount = computed(() =>
    this.transferStore.senderAccount(),
  );
  public readonly selectedRecipientAccount = computed(() =>
    this.transferStore.selectedRecipientAccount(),
  );

  public readonly senderAccounts = toSignal(this.store.select(selectAccounts), {
    initialValue: [],
  });
  public readonly isLoadingSenderAccounts = toSignal(
    this.store.select(selectIsLoading),
    { initialValue: false },
  );
  public readonly senderAccountsError = toSignal(
    this.store.select(selectError),
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

    if (info.accounts) return info.accounts;

    if (info.currency) {
      return [
        {
          id: 'iban-recipient',
          iban: this.transferStore.recipientInput(),
          currency: info.currency,
        },
      ];
    }

    return [];
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
  }
  public ngOnInit(): void {
    const accounts = this.senderAccounts();
    const isLoading = this.isLoadingSenderAccounts();

    if ((!accounts || accounts.length === 0) && !isLoading) {
      this.store.dispatch(AccountsActions.loadAccounts());
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
    return this.transferExternalService.isRecipientAccountDisabled(
      account,
      this.selectedSenderAccount(),
    );
  };

  public isSenderAccountDisabled = (account: Account): boolean => {
    return this.transferExternalService.isSenderAccountDisabled(
      account,
      this.selectedRecipientAccount(),
      this.isExternalIban(),
    );
  };

  public onRecipientAccountSelect(account: Account | RecipientAccount): void {
    this.transferExternalService.handleRecipientAccountSelect(
      account as RecipientAccount,
      this.selectedRecipientAccount(),
    );
  }

  public onSenderAccountSelect(account: AccountData): void {
    this.transferExternalService.handleSenderAccountSelect(
      account as Account,
      this.selectedSenderAccount(),
    );
  }

  public onRetrySenderAccounts(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public onRetry(): void {
    this.transferExternalService.handleRetryRecipientLookup(
      this.transferStore.recipientInput(),
      this.transferStore.recipientType(),
    );
  }

  public onGoBack(): void {
    this.location.back();
  }

  public onContinue(): void {
    this.transferExternalService.handleContinue(
      this.selectedRecipientAccount(),
      this.selectedSenderAccount(),
      this.isExternalIban(),
      this.recipientNameInput.value,
    );
  }
}
