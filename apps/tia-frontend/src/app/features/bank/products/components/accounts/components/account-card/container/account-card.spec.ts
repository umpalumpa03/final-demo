import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1000.5);
    expect(formatted).toBe('1,000.50');
  });

  it('should return correct icon for current account type', () => {
    const icon = component.getAccountIcon(AccountType.current);
    expect(icon).toBe('/images/svg/account/wallet.svg');
  });

  it('should emit transfer with account id when handleTransfer is called', () => {
    const spy = vi.spyOn(component.transfer, 'emit');
    component.handleTransfer();
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should emit rename with account id and friendly name when handleRename is called', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component.handleRename('New Account Name');
    expect(spy).toHaveBeenCalledWith({
      accountId: '1',
      friendlyName: 'New Account Name',
    });
  });

  it('should compute accountIcon from account type', () => {
    expect(component['accountIcon']()).toBe('/images/svg/account/wallet.svg');
  });

  it('should update computed accountIcon when account type changes', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        type: AccountType.saving,
      });
    });
    expect(component['accountIcon']()).toBe(
      '/images/svg/account/piggy-bank.svg',
    );
  });

  it('should update computed formattedBalance when account balance changes', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        balance: 5000,
      });
    });
    const formatted = component['formattedBalance']();
    expect(formatted).toContain('5');
  });

  it('should update computed formattedDate when account createdAt changes', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        createdAt: '2025-12-25',
      });
    });
    const formatted = component['formattedDate']();
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });
});
