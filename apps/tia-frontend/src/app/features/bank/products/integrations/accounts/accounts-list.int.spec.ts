import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { AccountsListComponent } from '../../components/accounts/components/accounts-list/accounts-list';
import {
  AccountType,
  GroupedAccounts,
  AccountSection,
} from '@tia/shared/models/accounts/accounts.model';
import {
  mockAccount,
  mockAccount2,
  mockAccount3,
} from './accounts.test-helpers';

describe('AccountsList Component Integration Tests', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;

  const mockGroupedAccounts: GroupedAccounts = {
    current: [mockAccount],
    saving: [mockAccount2],
    card: [mockAccount3],
  };

  const mockAccountSections: AccountSection[] = [
    {
      key: AccountType.current,
      title: 'Current Accounts',
      icon: 'current-icon',
    },
    { key: AccountType.saving, title: 'Savings Accounts', icon: 'saving-icon' },
    { key: AccountType.card, title: 'Card Accounts', icon: 'card-icon' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsListComponent, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('accountsGrouped', mockGroupedAccounts);
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('accountSections', mockAccountSections);
      fixture.componentRef.setInput('isRenamingAccount', false);
      fixture.detectChanges();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create and initialize with inputs', () => {
      expect(component).toBeTruthy();
      expect(component.accountsGrouped()).toEqual(mockGroupedAccounts);
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('Account Display', () => {
    it('should display grouped accounts with correct properties', () => {
      const grouped = component.accountsGrouped();
      expect(grouped?.current.length).toBe(1);
      expect(grouped?.current[0].id).toBe('acc-123');
    });
  });

  describe('Transfer Functionality', () => {
    it('should open modal and store account data when handleTransfer is called', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('accountsGrouped', mockGroupedAccounts);
        fixture.detectChanges();

        component.handleTransfer('acc-123');

        expect(component.showTransferModal()).toBe(true);
        expect(component.selectedAccountForTransfer()).toBe('acc-123');
        expect(component.selectedAccountPermission()).toBe(
          mockAccount.permission,
        );
      });
    });

    it('should emit transfer event when permission is selected', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('accountsGrouped', mockGroupedAccounts);
        const transferSpy = vi.spyOn(component.transfer, 'emit');
        component.selectedAccountForTransfer.set('acc-123');

        component.handlePermissionSelected(1);

        expect(transferSpy).toHaveBeenCalledWith({
          account: mockAccount,
          permissionValue: 1,
        });
        expect(component.showTransferModal()).toBe(false);
      });
    });
  });

  describe('Account Rename', () => {
    it('should emit rename event with account data', () => {
      const renameSpy = vi.spyOn(component.renameAccount, 'emit');

      component.handleRenameClick({
        accountId: 'acc-123',
        friendlyName: 'Updated Name',
      });

      expect(renameSpy).toHaveBeenCalledWith({
        accountId: 'acc-123',
        friendlyName: 'Updated Name',
      });
    });
  });
});
