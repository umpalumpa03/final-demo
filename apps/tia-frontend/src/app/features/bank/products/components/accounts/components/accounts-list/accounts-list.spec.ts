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
    createdAt: '2024-01-01',
    openedAt: '2024-01-01',
    closedAt: '',
    isFavorite: false,
  };

  const mockGroupedAccounts = {
    current: [mockAccount],
    saving: [],
    card: [],
  };

  const mockEmptyGroupedAccounts = {
    current: [],
    saving: [],
    card: [],
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', mockGroupedAccounts);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('accountSections', mockAccountSections);
      fixture.componentRef.setInput('isRenamingAccount', false);
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit openModal when handleOpenModal is called', () => {
    const spy = vi.spyOn(component.openModal, 'emit');
    component.handleOpenModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit transfer with account id when handleTransfer is called', () => {
    const spy = vi.spyOn(component.transfer, 'emit');
    component.handleTransfer('account-123');
    expect(spy).toHaveBeenCalledWith('account-123');
  });

  it('should emit retry when handleRetry is called', () => {
    const spy = vi.spyOn(component.retry, 'emit');
    component.handleRetry();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit renameAccount when handleRenameClick is called', () => {
    const spy = vi.spyOn(component.renameAccount, 'emit');
    const renameData = { accountId: 'acc-1', friendlyName: 'New Name' };
    component.handleRenameClick(renameData);
    expect(spy).toHaveBeenCalledWith(renameData);
  });

  it('should compute hasNoAccounts as true when all account arrays are empty', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', mockEmptyGroupedAccounts);
    });
    expect(component.hasNoAccounts()).toBe(true);
  });

  it('should compute hasNoAccounts as false when accounts exist', () => {
    expect(component.hasNoAccounts()).toBe(false);
  });

  it('should compute hasNoAccounts as false when accountsGrouped is null', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', null);
    });
    expect(component.hasNoAccounts()).toBe(false);
  });

  it('should compute visibleSections with accounts', () => {
    const visible = component.visibleSections();
    expect(visible.length).toBeGreaterThan(0);
    expect(visible[0].key).toBe(AccountType.current);
  });

  it('should compute visibleSections as empty when no accounts', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', mockEmptyGroupedAccounts);
    });
    expect(component.visibleSections().length).toBe(0);
  });

  it('should compute visibleSections as empty when accountsGrouped is null', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', null);
    });
    expect(component.visibleSections().length).toBe(0);
  });

  it('should return accounts for a given section', () => {
    const section = mockAccountSections[0];
    const accounts = component.getAccountsBySection(section);
    expect(accounts.length).toBe(1);
    expect(accounts[0].id).toBe('1');
  });

  it('should return empty array for section with no accounts', () => {
    const section = mockAccountSections[1];
    const accounts = component.getAccountsBySection(section);
    expect(accounts.length).toBe(0);
  });

  it('should return empty array when accountsGrouped is null', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', null);
    });
    const section = mockAccountSections[0];
    const accounts = component.getAccountsBySection(section);
    expect(accounts.length).toBe(0);
  });

  it('should have correct input defaults', () => {
    expect(component.error()).toBeNull();
    expect(component.renameError()).toBeNull();
  });
});
