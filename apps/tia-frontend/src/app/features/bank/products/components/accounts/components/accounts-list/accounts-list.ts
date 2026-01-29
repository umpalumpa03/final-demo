import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountCardComponent } from '../account-card/container/account-card';
import { ButtonComponent } from '../../../../../../../shared/lib/primitives/button/button';
import { RouteLoader } from '../../../../../../../shared/lib/feedback/route-loader/route-loader';
import {
  AccountSection,
  GroupedAccounts,
} from '../../../../../../../shared/models/accounts/accounts.model';
import { ErrorStates } from '../../../../../../../shared/lib/feedback/error-states/error-states';
import { ScrollArea } from '../../../../../../../shared/lib/layout/components/scroll-area/container/scroll-area';
import { RenameAccountModalComponent } from '../rename-account-modal/rename-account-modal';

@Component({
  selector: 'app-accounts-list',
  imports: [
    CommonModule,
    AccountCardComponent,
    ButtonComponent,
    RouteLoader,
    ErrorStates,
    ScrollArea,
    RenameAccountModalComponent,
  ],
  templateUrl: './accounts-list.html',
  styleUrl: './accounts-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent {
  public accountsGrouped = input.required<GroupedAccounts | null>();
  public isLoading = input.required<boolean>();
  public error = input<string | null>(null);
  public accountSections = input.required<AccountSection[]>();
  public isRenamingAccount = input.required<boolean>();
  public renameError = input<string | null>(null);

  public openModal = output<void>();
  public transfer = output<string>();
  public retry = output<void>();
  public renameAccount = output<{ accountId: string; friendlyName: string }>();

  protected renameModalOpen = signal<boolean>(false);
  protected selectedAccountId = signal<string | null>(null);

  public hasNoAccounts = computed(() => {
    const grouped = this.accountsGrouped();
    if (!grouped) return false;
    return (
      grouped.current.length === 0 &&
      grouped.saving.length === 0 &&
      grouped.card.length === 0
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

  public handleRenameClick(accountId: string): void {
    this.selectedAccountId.set(accountId);
    this.renameModalOpen.set(true);
  }

  public handleRenameModalClose(): void {
    this.renameModalOpen.set(false);
    this.selectedAccountId.set(null);
  }

  public handleRenameSubmit(friendlyName: string): void {
    const accountId = this.selectedAccountId();
    if (accountId) {
      this.renameAccount.emit({ accountId, friendlyName });
      this.renameModalOpen.set(false);
      this.selectedAccountId.set(null);
    }
  }

  public getSelectedAccountName(): string {
    const accountId = this.selectedAccountId();
    if (!accountId) return '';
    const grouped = this.accountsGrouped();
    if (!grouped) return '';
    const allAccounts = [
      ...grouped.current,
      ...grouped.saving,
      ...grouped.card,
    ];
    const account = allAccounts.find((acc) => acc.id === accountId);
    return account?.friendlyName || account?.name || '';
  }
}
