import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { shareReplay } from 'rxjs/operators';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AccountsListComponent } from '../components/accounts-list/accounts-list';
import { CreateAccountComponent } from '../components/create-account/components/create-account';
import {
  CreateAccountRequest,
  AccountType,
} from '../../../../../../shared/models/accounts/accounts.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  selectAccountsGrouped,
  selectAccounts,
  selectError,
  selectIsLoading,
  selectIsFetching,
  selectIsCreateModalOpen,
  selectIsUpdatingFriendlyName,
  selectUpdateFriendlyNameError,
  selectIsCreating,
  selectCreateError,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { getAccountSections } from '../config/accounts.config';
import { DismissibleAlerts } from '../../../../../../shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';

@Component({
  selector: 'app-accounts-page',
  imports: [
    CommonModule,
    TranslateModule,
    AccountsListComponent,
    CreateAccountComponent,
    DismissibleAlerts,
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly accountsService = inject(AccountsApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  protected readonly accountsGrouped$ = this.store.select(
    selectAccountsGrouped,
  );
  protected readonly isLoading$ = this.store.select(selectIsLoading);
  protected readonly isFetching$ = this.store.select(selectIsFetching);
  protected readonly isCreateModalOpen$ = this.store.select(
    selectIsCreateModalOpen,
  );
  protected readonly error$ = this.store.select(selectError);
  protected readonly isRenamingAccount$ = this.store.select(
    selectIsUpdatingFriendlyName,
  );
  protected readonly renameError$ = this.store.select(
    selectUpdateFriendlyNameError,
  );
  protected readonly isCreatingAccount$ = this.store.select(selectIsCreating);
  protected readonly createError$ = this.store.select(selectCreateError);

  protected readonly accountsGroupedSignal = this.store.selectSignal(
    selectAccountsGrouped,
  );
  protected readonly accountsSignal = this.store.selectSignal(selectAccounts);
  protected readonly isLoadingSignal = this.store.selectSignal(selectIsLoading);
  protected readonly isCreatingAccountSignal =
    this.store.selectSignal(selectIsCreating);
  protected readonly createErrorSignal =
    this.store.selectSignal(selectCreateError);

  protected readonly accountSectionsData = signal(
    getAccountSections(this.translate),
  );
  protected readonly accountTypeValues = Object.values(AccountType);
  protected readonly currencyValues = this.accountsService
    .getCurrencies()
    .pipe(shareReplay(1));

  protected accountForm = signal<FormGroup>(this.createAccountForm());
  protected showSuccessAlert = signal<boolean>(false);
  protected showCreateAlert = signal<boolean>(false);
  protected showCreateErrorAlert = signal<boolean>(false);
  protected errorTypeSignal = signal<'connection' | 'loading' | null>(null);

  private wasCreating = false;

  constructor() {
    effect(() => {
      const isCreating = this.isCreatingAccountSignal();
      if (isCreating !== undefined) {
        this.handleIsCreatingAccount(isCreating);
      }
    });
  }

  private createAccountForm(): FormGroup {
    return this.fb.group({
      friendlyName: ['', Validators.minLength(3)],
      type: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadActiveAccounts({}));

    if (this.router.url.includes('/create')) {
      this.store.dispatch(AccountsActions.openCreateModal());
    }
  }

  private handleIsCreatingAccount(isCreating: boolean): void {
    if (!isCreating && this.wasCreating) {
      const error = this.createErrorSignal();
      if (error) {
        this.showCreateErrorAlert.set(true);
        this.showCreateAlert.set(false);
      } else {
        this.showCreateAlert.set(true);
        this.showCreateErrorAlert.set(false);
      }
    }
    this.wasCreating = isCreating;
  }

  public handleOpenModal(): void {
    this.router.navigate(['/bank/products/accounts/create']);
  }

  public handleCloseModal(): void {
    this.store.dispatch(AccountsActions.closeCreateModal());
    this.router.navigate(['/bank/products/accounts']);
  }

  public handleCreateAccount(request: CreateAccountRequest): void {
    if (this.accountForm().valid) {
      this.showCreateAlert.set(false);
      this.showCreateErrorAlert.set(false);
      this.store.dispatch(AccountsActions.createAccount({ request }));
      this.accountForm.set(this.createAccountForm());
      this.router.navigate(['/bank/products/accounts']);
    }
  }

  public handleTransfer(data: {
    accountId: string;
    permissionValue: number;
  }): void {
    const accounts = this.accountsSignal();
    const account = accounts?.find((acc) => acc.id === data.accountId) || null;
    this.store.dispatch(AccountsActions.selectAccount({ account }));

    const permissionMap: { [key: number]: string } = {
      1: '/bank/transfers/internal',
      2: '/bank/transfers/external',
      4: '/bank/transfers/external',
      8: '/bank/paybill',
      16: '/bank/paybill',
      32: '/bank/loans',
    };

    const route = permissionMap[data.permissionValue];
    if (route) {
      this.router.navigate([route], {
        queryParams: { accountId: data.accountId },
      });
    }
  }

  public handleRetry(): void {
    this.store.dispatch(
      AccountsActions.loadActiveAccounts({ forceRefresh: true }),
    );
  }

  public handleRenameAccount(data: {
    accountId: string;
    friendlyName: string;
  }): void {
    this.store.dispatch(
      AccountsActions.updateFriendlyName({
        accountId: data.accountId,
        friendlyName: data.friendlyName,
      }),
    );
  }

  public handleRenameSuccess(): void {
    this.showSuccessAlert.set(true);
  }

  public handleAlertDismissed(): void {
    this.showSuccessAlert.set(false);
  }

  public handleCreateAlertDismissed(): void {
    this.showCreateAlert.set(false);
  }

  public handleCreateErrorAlertDismissed(): void {
    this.showCreateErrorAlert.set(false);
  }
}
