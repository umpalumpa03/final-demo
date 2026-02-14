import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountCardComponent } from '../account-card/container/account-card';
import { RouteLoader } from '../../../../../../../shared/lib/feedback/route-loader/route-loader';
import {
  AccountSection,
  GroupedAccounts,
  Account,
} from '../../../../../../../shared/models/accounts/accounts.model';
import { ErrorStates } from '../../../../../../../shared/lib/feedback/error-states/error-states';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { Badges } from '../../../../../../../shared/lib/primitives/badges/badges';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TransferPermissionsModalComponent } from '../account-card/components/transfer-permissions-modal/transfer-permissions-modal';
import { Skeleton } from '../../../../../../../shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-accounts-list',
  imports: [
    CommonModule,
    TranslatePipe,
    AccountCardComponent,
    RouteLoader,
    ErrorStates,
    LibraryTitle,
    Badges,
    ButtonComponent,
    TransferPermissionsModalComponent,
    Skeleton,
  ],
  templateUrl: './accounts-list.html',
  styleUrl: './accounts-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListComponent implements OnInit {
  public accountsGrouped = input.required<GroupedAccounts | null>();
  public isLoading = input.required<boolean>();

  public isFetching = input<boolean>(false);

  public error = input<string | null>(null);
  public errorType = input<'connection' | 'loading' | null>(null);
  public accountSections = input.required<AccountSection[]>();
  public isRenamingAccount = input.required<boolean>();
  public renameError = input<string | null>(null);

  public openModal = output<void>();
  public transfer = output<{ account: Account; permissionValue: number }>();
  public retry = output<void>();
  public renameAccount = output<{ accountId: string; friendlyName: string }>();
  public renameSuccess = output<void>();

  private readonly GAP_SIZE_LARGE = 4;
  private readonly GAP_SIZE_SMALL = 2.2;
  private readonly GAP_SIZE_MEDIUM = 2;

  public currentPageBySection = signal<Record<string, number>>({});

  public skeletonItems = computed(() =>
    Array.from({ length: this.itemsPerPage() }, (_, i) => i + 1),
  );
  private itemsPerPage = signal<number>(3);
  private screenWidth = signal<number>(0);
  public showTransferModal = signal<boolean>(false);
  public selectedAccountForTransfer = signal<string | null>(null);
  public selectedAccountPermission = signal<number>(0);
  public selectedAccountCurrency = signal<string>('');

  ngOnInit(): void {
    const width = window.innerWidth;
    this.screenWidth.set(width);
    this.updateItemsPerPage(width);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const target = event.target as Window;
    const width = target.innerWidth;
    this.screenWidth.set(width);
    this.updateItemsPerPage(width);
    this.currentPageBySection.set({});
  }

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

  public getTransformOffset(sectionKey: string): string {
    const currentPage = this.getCurrentPage(sectionKey);
    const itemsPerPage = this.itemsPerPage();
    const percentOffset = currentPage * 100;

    if (itemsPerPage === 1) {
      const gapSize =
        this.screenWidth() <= 425 ? this.GAP_SIZE_SMALL : this.GAP_SIZE_LARGE;
      const totalGapOffset = currentPage * gapSize;
      return `translateX(calc(-${percentOffset}% - ${totalGapOffset}rem))`;
    }

    const gapSize =
      this.screenWidth() <= 1250 ? this.GAP_SIZE_LARGE : this.GAP_SIZE_MEDIUM;
    const gapsPerPage = itemsPerPage - 1;
    const totalGapOffset = currentPage * gapsPerPage * gapSize;
    return `translateX(calc(-${percentOffset}% - ${totalGapOffset}rem))`;
  }

  public updateItemsPerPage(width: number): void {
    if (width <= 800) {
      this.itemsPerPage.set(1);
    } else if (width <= 1250) {
      this.itemsPerPage.set(2);
    } else {
      this.itemsPerPage.set(3);
    }
  }

  public getCurrentPage(sectionKey: string): number {
    return this.currentPageBySection()[sectionKey] ?? 0;
  }

  public getTotalPages(section: AccountSection): number {
    const accounts = this.getAccountsBySection(section);
    return Math.ceil(accounts.length / this.itemsPerPage());
  }

  public needsPagination(section: AccountSection): boolean {
    const accounts = this.getAccountsBySection(section);
    return accounts.length > this.itemsPerPage();
  }

  public canGoPrevious(sectionKey: string): boolean {
    return this.getCurrentPage(sectionKey) > 0;
  }

  public canGoNext(section: AccountSection): boolean {
    const currentPage = this.getCurrentPage(section.key);
    const totalPages = this.getTotalPages(section);
    return currentPage < totalPages - 1;
  }

  public goToPrevious(sectionKey: string): void {
    this.currentPageBySection.update((pages) => ({
      ...pages,
      [sectionKey]: Math.max(0, (pages[sectionKey] ?? 0) - 1),
    }));
  }

  public goToNext(sectionKey: string): void {
    this.currentPageBySection.update((pages) => ({
      ...pages,
      [sectionKey]: (pages[sectionKey] ?? 0) + 1,
    }));
  }

  public handleOpenModal(): void {
    this.openModal.emit();
  }

  public handleTransfer(accountId: string): void {
    const accounts = this.accountsGrouped();
    if (!accounts) return;

    const allAccounts = [
      ...(accounts.current || []),
      ...(accounts.saving || []),
      ...(accounts.card || []),
    ];

    const account = allAccounts.find((acc) => acc.id === accountId);
    if (account) {
      this.selectedAccountForTransfer.set(accountId);
      this.selectedAccountPermission.set(account.permission);
      this.selectedAccountCurrency.set(account.currency);
      this.showTransferModal.set(true);
    }
  }

  public handlePermissionSelected(permissionValue: number): void {
    const accountId = this.selectedAccountForTransfer();
    if (accountId) {
      const accounts = this.accountsGrouped();
      if (!accounts) return;
      const allAccounts: Account[] = [
        ...(accounts.current || []),
        ...(accounts.saving || []),
        ...(accounts.card || []),
      ];
      const account = allAccounts.find((acc: Account) => acc.id === accountId);
      if (account) {
        this.showTransferModal.set(false);
        this.transfer.emit({ account, permissionValue });
      }
    }
  }

  public handleModalClosed(): void {
    this.showTransferModal.set(false);
    this.selectedAccountForTransfer.set(null);
    this.selectedAccountPermission.set(0);
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
