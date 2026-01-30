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
import { Router } from '@angular/router';
import { shareReplay } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AccountsListComponent } from '../components/accounts-list/accounts-list';
import { CreateAccountComponent } from '../components/create-account/components/create-account';
import {
  CreateAccountRequest,
  AccountType,
} from '../../../../../../shared/models/accounts/accounts.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  selectAccountsGrouped,
  selectError,
  selectIsLoading,
  selectIsCreateModalOpen,
  selectIsCreating,
  selectCreateError,
  selectIsUpdatingFriendlyName,
  selectUpdateFriendlyNameError,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { getAccountSections } from '../config/accounts.config';
import { AccountsService } from 'apps/tia-frontend/src/app/shared/services/accounts/accounts.service';

@Component({
  selector: 'app-accounts-page',
  imports: [CommonModule, AccountsListComponent, CreateAccountComponent],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly accountsService = inject(AccountsService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected readonly accountsGrouped$ = this.store.select(
    selectAccountsGrouped,
  );
  protected readonly isLoading$ = this.store.select(selectIsLoading);
  protected readonly isCreating$ = this.store.select(selectIsCreating);
  protected readonly isCreateModalOpen$ = this.store.select(
    selectIsCreateModalOpen,
  );
  protected readonly error$ = this.store.select(selectError);
  protected readonly createError$ = this.store.select(selectCreateError);
  protected readonly isRenamingAccount$ = this.store.select(
    selectIsUpdatingFriendlyName,
  );
  protected readonly renameError$ = this.store.select(
    selectUpdateFriendlyNameError,
  );

  protected readonly accountSectionsData = signal(
    getAccountSections(this.translate),
  );
  protected readonly accountTypeValues = Object.values(AccountType);
  protected readonly currencyValues = this.accountsService
    .getCurrencies()
    .pipe(shareReplay(1));

  protected accountForm = signal<FormGroup>(this.createAccountForm());

  private createAccountForm(): FormGroup {
    return this.fb.group({
      friendlyName: ['', Validators.minLength(3)],
      type: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public handleOpenModal(): void {
    this.store.dispatch(AccountsActions.openCreateModal());
  }

  public handleCloseModal(): void {
    this.store.dispatch(AccountsActions.closeCreateModal());
  }

  public handleCreateAccount(request: CreateAccountRequest): void {
    if (this.accountForm().valid) {
      this.store.dispatch(AccountsActions.createAccount({ request }));
      this.accountForm.set(this.createAccountForm());
    }
  }

  public handleTransfer(accountId: string): void {
    this.store.dispatch(AccountsActions.selectAccount({ accountId }));
    this.router.navigate(['/bank/transfers/internal']);
  }

  public handleRetry(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
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
