import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';
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
  };

  const mockAccountSections = [
    { key: AccountType.current, title: 'Current Accounts', icon: '/images/svg/account/wallet.svg' },
    { key: AccountType.saving, title: 'Saving Accounts', icon: '/images/svg/account/piggy-bank.svg' },
    { key: AccountType.card, title: 'Card Accounts', icon: '/images/svg/account/building.svg' },
  ];

  const setInputs = (grouped: { current: Account[]; saving: Account[]; card: Account[] } | null) => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', grouped);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('accountSections', mockAccountSections);
      fixture.componentRef.setInput('isRenamingAccount', false);
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    setInputs({ current: [mockAccount], saving: [], card: [] });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit events correctly', () => {
    const openModalSpy = vi.spyOn(component.openModal, 'emit');
    const transferSpy = vi.spyOn(component.transfer, 'emit');
    const retrySpy = vi.spyOn(component.retry, 'emit');
    const renameAccountSpy = vi.spyOn(component.renameAccount, 'emit');

    component.handleOpenModal();
    expect(openModalSpy).toHaveBeenCalled();

    component.handleTransfer('account-123');
    expect(transferSpy).toHaveBeenCalledWith('account-123');

    component.handleRetry();
    expect(retrySpy).toHaveBeenCalled();

    const renameData = { accountId: 'acc-1', friendlyName: 'New Name' };
    component.handleRenameClick(renameData);
    expect(renameAccountSpy).toHaveBeenCalledWith(renameData);
  });

  it('should compute hasNoAccounts correctly', () => {
    expect(component.hasNoAccounts()).toBe(false);

    setInputs({ current: [], saving: [], card: [] });
    expect(component.hasNoAccounts()).toBe(true);

    setInputs(null);
    expect(component.hasNoAccounts()).toBe(false);
  });

  it('should compute visibleSections correctly', () => {
    const visible = component.visibleSections();
    expect(visible.length).toBeGreaterThan(0);
    expect(visible[0].key).toBe(AccountType.current);

    setInputs({ current: [], saving: [], card: [] });
    expect(component.visibleSections().length).toBe(0);

    setInputs(null);
    expect(component.visibleSections().length).toBe(0);
  });

  it('should return accounts by section', () => {
    const accounts = component.getAccountsBySection(mockAccountSections[0]);
    expect(accounts.length).toBe(1);
    expect(accounts[0].id).toBe('1');

    const emptyAccounts = component.getAccountsBySection(mockAccountSections[1]);
    expect(emptyAccounts.length).toBe(0);

    setInputs(null);
    const nullAccounts = component.getAccountsBySection(mockAccountSections[0]);
    expect(nullAccounts.length).toBe(0);
  });

  it('should have correct input defaults', () => {
    expect(component.error()).toBeNull();
    expect(component.renameError()).toBeNull();
  });
});
