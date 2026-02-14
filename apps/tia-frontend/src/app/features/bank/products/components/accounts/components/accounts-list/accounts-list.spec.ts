import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AccountsListComponent } from './accounts-list';
import {
  AccountType,
  Account,
} from '../../../../../../../shared/models/accounts/accounts.model';

describe('AccountsListComponent', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;

  const mockAccount: Account = {
    id: '1',
    userId: 'user1',
    permission: 1,
    friendlyName: 'Test Account',
    type: AccountType.current,
    balance: 1000,
    currency: 'USD',
    iban: 'DE89370400440532013000',
    name: 'Test Account',
    status: 'active',
    createdAt: '2026-01-01',
    openedAt: '2026-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
  };

  const mockAccountSections = [
    {
      key: AccountType.current,
      title: 'Current Accounts',
      icon: '/images/svg/account/wallet.svg',
    },
    {
      key: AccountType.saving,
      title: 'Saving Accounts',
      icon: '/images/svg/account/piggy-bank.svg',
    },
    {
      key: AccountType.card,
      title: 'Card Accounts',
      icon: '/images/svg/account/building.svg',
    },
  ];

  const setInputs = (
    grouped: { current: Account[]; saving: Account[]; card: Account[] } | null,
  ) => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', grouped);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('accountSections', mockAccountSections);
      fixture.componentRef.setInput('isRenamingAccount', false);
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListComponent, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    setInputs({ current: [mockAccount], saving: [], card: [] });
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and emit events', () => {
    expect(component).toBeTruthy();
    const openSpy = vi.spyOn(component.openModal, 'emit');
    const transferSpy = vi.spyOn(component.transfer, 'emit');
    const retrySpy = vi.spyOn(component.retry, 'emit');
    const renameSpy = vi.spyOn(component.renameAccount, 'emit');

    component.handleOpenModal();
    expect(openSpy).toHaveBeenCalled();
    component.handleTransfer('1');
    component.handlePermissionSelected(1);
    expect(transferSpy).toHaveBeenCalledWith({
      account: mockAccount,
      permissionValue: 1,
    });
    component.handleRetry();
    expect(retrySpy).toHaveBeenCalled();
    component.handleRenameClick({
      accountId: 'acc-1',
      friendlyName: 'New Name',
    });
    expect(renameSpy).toHaveBeenCalledWith({
      accountId: 'acc-1',
      friendlyName: 'New Name',
    });
  });

  it('should compute hasNoAccounts and visibleSections', () => {
    expect(component.hasNoAccounts()).toBe(false);
    expect(component.visibleSections().length).toBeGreaterThan(0);
    expect(component.visibleSections()[0].key).toBe(AccountType.current);

    setInputs({ current: [], saving: [], card: [] });
    expect(component.hasNoAccounts()).toBe(true);
    expect(component.visibleSections().length).toBe(0);

    setInputs(null);
    expect(component.hasNoAccounts()).toBe(false);
    expect(component.visibleSections().length).toBe(0);
  });

  it('should return accounts by section', () => {
    expect(component.getAccountsBySection(mockAccountSections[0])).toEqual([
      mockAccount,
    ]);
    expect(component.getAccountsBySection(mockAccountSections[1]).length).toBe(
      0,
    );
    setInputs(null);
    expect(component.getAccountsBySection(mockAccountSections[0]).length).toBe(
      0,
    );
  });
  it('should handle pagination correctly', () => {
    expect(component.getCurrentPage('current')).toBe(0);
    component.goToNext('current');
    expect(component.getCurrentPage('current')).toBe(1);
    component.goToPrevious('current');
    expect(component.getCurrentPage('current')).toBe(0);
  });
  it('should update items per page on resize', () => {
    component.updateItemsPerPage(500);
    expect(component['itemsPerPage']()).toBe(1);
    component.updateItemsPerPage(1000);
    expect(component['itemsPerPage']()).toBe(2);
    component.updateItemsPerPage(1500);
    expect(component['itemsPerPage']()).toBe(3);
  });

  it('should handle modal closed', () => {
    component.handleModalClosed();
    expect(component.showTransferModal()).toBe(false);
    expect(component.selectedAccountForTransfer()).toBeNull();
    expect(component.selectedAccountPermission()).toBe(0);
  });

  it('should handle rename success', () => {
    const renameSpy = vi.spyOn(component.renameSuccess, 'emit');
    component.handleRenameSuccess();
    expect(renameSpy).toHaveBeenCalled();
  });
  it('should handle transfer with valid account', () => {
    component.handleTransfer('1');
    expect(component.selectedAccountForTransfer()).toBe('1');
    expect(component.selectedAccountPermission()).toBe(1);
    expect(component.showTransferModal()).toBe(true);
  });
  it('should not emit transfer if no account selected', () => {
    const transferSpy = vi.spyOn(component.transfer, 'emit');
    component.handlePermissionSelected(1);
    expect(transferSpy).not.toHaveBeenCalled();
  });
});
