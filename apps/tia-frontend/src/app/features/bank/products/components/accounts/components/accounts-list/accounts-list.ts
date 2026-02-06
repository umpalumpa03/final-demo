import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountCardComponent } from '../account-card/container/account-card';
import { RouteLoader } from '../../../../../../../shared/lib/feedback/route-loader/route-loader';
import {
  AccountSection,
  GroupedAccounts,
} from '../../../../../../../shared/models/accounts/accounts.model';
import { ErrorStates } from '../../../../../../../shared/lib/feedback/error-states/error-states';
import { ScrollArea } from '../../../../../../../shared/lib/layout/components/scroll-area/container/scroll-area';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { Badges } from '../../../../../../../shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-accounts-list',
  imports: [
    CommonModule,
    TranslatePipe,
    AccountCardComponent,
    RouteLoader,
    ErrorStates,
    ScrollArea,
    LibraryTitle,
    Badges,
  ],
  templateUrl: './accounts-list.html',
  styleUrl: './accounts-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent {
  public accountsGrouped = input.required<GroupedAccounts | null>();
  public isLoading = input.required<boolean>();

  public isFetching = input<boolean>(false);

  public error = input<string | null>(null);
  public errorType = input<'connection' | 'loading' | null>(null);
  public accountSections = input.required<AccountSection[]>();
  public isRenamingAccount = input.required<boolean>();
  public renameError = input<string | null>(null);

  public openModal = output<void>();
  public transfer = output<string>();
  public retry = output<void>();
  public renameAccount = output<{ accountId: string; friendlyName: string }>();
  public renameSuccess = output<void>();

  public hasNoAccounts = computed(() => {
    const grouped = this.accountsGrouped();
    if (!grouped) return false;
    return (
      (grouped.current?.length ?? 0) === 0 &&
      (grouped.saving?.length ?? 0) === 0 &&
      (grouped.card?.length ?? 0) === 0
    );
  });

  public visibleSections = computed(() => {
    const grouped = this.accountsGrouped();
    const sections = this.accountSections();
    if (!grouped) return [];
    return sections.filter(
      (section) => grouped[section.key as keyof GroupedAccounts].length > 0,
    );
  });

  private groupedAccountsMemo = computed(() => this.accountsGrouped());

  public getAccountsBySection(section: AccountSection) {
    const grouped = this.groupedAccountsMemo();
    if (!grouped) return [];
    return grouped[section.key as keyof GroupedAccounts];
  }

  public handleOpenModal(): void {
    this.openModal.emit();
  }

  public handleTransfer(accountId: string): void {
    this.transfer.emit(accountId);
  }

  public handleRetry(): void {
    this.retry.emit();
  }

  public handleRenameClick(data: {
    accountId: string;
    friendlyName: string;
  }): void {
    this.renameAccount.emit(data);
  }

  public handleRenameSuccess(): void {
    this.renameSuccess.emit();
  }
}
