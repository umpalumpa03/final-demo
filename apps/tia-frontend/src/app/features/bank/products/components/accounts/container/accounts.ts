import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { shareReplay } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
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
import { AccountsService } from 'apps/tia-frontend/src/app/shared/services/accounts/accounts.service';
import { DismissibleAlerts } from '../../../../../../shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';

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
export class Accounts implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly accountsService = inject(AccountsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

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
  private wasCreating = false;

  private createAccountForm(): FormGroup {
    return this.fb.group({
      friendlyName: ['', Validators.minLength(3)],
      type: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.accountsGrouped$
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts) => this.handleAccountsGrouped(accounts));

    if (this.router.url.includes('/create')) {
      this.store.dispatch(AccountsActions.openCreateModal());
    }

    this.isCreatingAccount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCreating) => this.handleIsCreatingAccount(isCreating));
  }

  private handleAccountsGrouped(accounts: any): void {
    if (
      !accounts ||
      (accounts.current.length === 0 &&
        accounts.saving.length === 0 &&
        accounts.card.length === 0)
    ) {
      this.store.dispatch(AccountsActions.loadAccounts());
    }
  }

  private handleIsCreatingAccount(isCreating: boolean): void {
    if (!isCreating && this.wasCreating) {
      this.createError$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
        if (error) {
          this.showCreateErrorAlert.set(true);
          this.showCreateAlert.set(false);
        } else {
          this.showCreateAlert.set(true);
          this.showCreateErrorAlert.set(false);
        }
      });
    }
    this.wasCreating = isCreating;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
