import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AccountCardComponent } from './account-card';
import { AccountType } from '../../../../../../../../shared/models/accounts/accounts.model';
import { provideTranslateService } from '@ngx-translate/core';

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  const mockAccount = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', mockAccount);
      fixture.componentRef.setInput('isRenaming', false);
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and format currency', () => {
    expect(component).toBeTruthy();
    expect(component.formatCurrency(1000.5)).toBe('1,000.50');
  });

  it('should return correct icon for account types', () => {
    expect(component.getAccountIcon(AccountType.current)).toBe(
      '/images/svg/account/wallet.svg',
    );
    expect(component.getAccountIcon(AccountType.saving)).toBe(
      '/images/svg/account/piggy-bank.svg',
    );
  });

  it('should emit transfer and rename events', () => {
    const transferSpy = vi.spyOn(component.transfer, 'emit');
    const renameSpy = vi.spyOn(component.rename, 'emit');
    component.handleTransfer();
    expect(transferSpy).toHaveBeenCalledWith('1');
    component.handleRename('New Account Name');
    expect(renameSpy).toHaveBeenCalledWith({
      accountId: '1',
      friendlyName: 'New Account Name',
    });
  });

  it('should compute account properties and update on changes', () => {
    expect(component['accountIcon']()).toBe('/images/svg/account/wallet.svg');
    expect(component['formattedBalance']()).toBeDefined();
    expect(component['formattedDate']()).toBeDefined();

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        type: AccountType.saving,
        balance: 5000,
        createdAt: '2025-12-25',
      });
    });
    expect(component['accountIcon']()).toBe(
      '/images/svg/account/piggy-bank.svg',
    );
    expect(component['formattedBalance']()).toContain('5');
    expect(typeof component['formattedDate']()).toBe('string');
  });
});
