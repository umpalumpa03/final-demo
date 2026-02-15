import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AccountsListComponent } from '../components/accounts-list/accounts-list';
import { CreateAccountComponent } from '../components/create-account/create-account';
import {
  CreateAccountRequest,
  AccountType,
  Account,
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
  selectCurrencies,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { getAccountSections } from '../shared/config/accounts.config';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '../../../../../../shared/lib/primitives/button/button';
import { TransferService } from '../services/transfer/transfer.service';
import { AlertService } from '@tia/core/services/alert/alert.service';

@Component({
  selector: 'app-accounts-page',
  imports: [
    CommonModule,
    TranslateModule,
    AccountsListComponent,
    CreateAccountComponent,
    LibraryTitle,
    ButtonComponent,
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly transferService = inject(TransferService);
  private readonly alertService = inject(AlertService);

  protected readonly accountsGrouped = this.store.selectSignal(
    selectAccountsGrouped,
  );
  protected readonly isLoading = this.store.selectSignal(selectIsLoading);
  protected readonly isFetching = this.store.selectSignal(selectIsFetching);
  protected readonly isCreateModalOpen = this.store.selectSignal(
    selectIsCreateModalOpen,
  );
  protected readonly error = this.store.selectSignal(selectError);
  protected readonly isRenamingAccount = this.store.selectSignal(
    selectIsUpdatingFriendlyName,
  );
  protected readonly renameError = this.store.selectSignal(
    selectUpdateFriendlyNameError,
  );
  protected readonly accounts = this.store.selectSignal(selectAccounts);
  protected readonly isCreatingAccount =
    this.store.selectSignal(selectIsCreating);
  protected readonly createError = this.store.selectSignal(selectCreateError);
  protected readonly currencies = this.store.selectSignal(selectCurrencies);

  protected readonly accountSectionsData = signal(
    getAccountSections(this.translate),
  );
  protected readonly accountTypeValues = Object.values(AccountType);

  protected accountForm = signal<FormGroup>(this.createAccountForm());

  private createAccountForm(): FormGroup {
    return this.fb.group({
      friendlyName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      type: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(
      AccountsActions.loadActiveAccounts({ forceRefresh: true }),
    );
    this.store.dispatch(AccountsActions.loadCurrencies());

    if (this.router.url.includes('/create')) {
      this.store.dispatch(AccountsActions.openCreateModal());
    }
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
      this.store.dispatch(AccountsActions.createAccount({ request }));
      this.accountForm.set(this.createAccountForm());
      this.router.navigate(['/bank/products/accounts']);
    }
  }

  public handleTransfer(data: {
    account: Account;
    permissionValue: number;
  }): void {
    this.store.dispatch(
      AccountsActions.selectAccount({ account: data.account }),
    );
    this.transferService.navigateToTransferPage(
      data.account.id,
      data.permissionValue,
    );
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
}
