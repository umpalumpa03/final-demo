import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AccountsListComponent } from '../components/accounts-list/accounts-list';
import { CreateAccountRequest } from '../../../../../../shared/models/accounts/accounts.model';
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
import { accountSections } from '../config/accounts.config';

@Component({
  selector: 'app-accounts-page',
  imports: [CommonModule, AccountsListComponent],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts implements OnInit {
  private readonly store = inject(Store);

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

  protected readonly accountSectionsData = accountSections;

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
    this.store.dispatch(AccountsActions.createAccount({ request }));
  }

  public handleTransfer(accountId: string): void {
    // this.store.dispatch(AccountsActions.transfer({ accountId }));
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
