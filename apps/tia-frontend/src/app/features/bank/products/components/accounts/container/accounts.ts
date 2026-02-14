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
import { CreateAccountComponent } from '../components/create-account/create-account';
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
import {
  getAccountSections,
  PERMISSION_ROUTE_MAP,
} from '../shared/config/accounts.config';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '../../../../../../shared/lib/primitives/button/button';

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
  private readonly accountsService = inject(AccountsApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
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

  protected readonly accountSectionsData = signal(
    getAccountSections(this.translate),
  );
  protected readonly accountTypeValues = Object.values(AccountType);
  protected readonly currencyValues = this.accountsService
    .getCurrencies()
    .pipe(shareReplay(1));

  protected accountForm = signal<FormGroup>(this.createAccountForm());
  protected errorTypeSignal = signal<'connection' | 'loading' | null>(null);

  private wasCreating = false;

  constructor() {
    effect(() => {
      const isCreating = this.isCreatingAccount();
      if (isCreating !== undefined) {
        this.handleIsCreatingAccount(isCreating);
      }
    });
  }

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

    if (this.router.url.includes('/create')) {
      this.store.dispatch(AccountsActions.openCreateModal());
    }
  }

  private handleIsCreatingAccount(isCreating: boolean): void {
    if (!isCreating && this.wasCreating) {
      const error = this.createError();
      if (error) {
        this.alertService.error(
          error ||
            this.translate.instant(
              'my-products.accounts.failedToCreateAccount',
            ),
          {
            variant: 'dismissible',
            title: this.translate.instant('my-products.accounts.error'),
          },
        );
      } else {
        this.alertService.info(
          this.translate.instant(
            'my-products.accounts.accountCreationRequestSent',
          ),
          {
            variant: 'dismissible',
            title: this.translate.instant('my-products.accounts.information'),
          },
        );
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
      this.alertService.clearAlert();
      this.store.dispatch(AccountsActions.createAccount({ request }));
      this.accountForm.set(this.createAccountForm());
      this.router.navigate(['/bank/products/accounts']);
    }
  }

  public handleTransfer(data: {
    accountId: string;
    permissionValue: number;
  }): void {
    const accounts = this.accounts();
    const account =
      accounts?.find((acc: any) => acc.id === data.accountId) || null;
    this.store.dispatch(AccountsActions.selectAccount({ account }));

    const route = PERMISSION_ROUTE_MAP[data.permissionValue];
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
    this.alertService.success(
      this.translate.instant(
        'my-products.accounts.accountNameUpdatedSuccessfully',
      ),
      {
        variant: 'dismissible',
        title: this.translate.instant('my-products.accounts.success'),
      },
    );
  }
}
