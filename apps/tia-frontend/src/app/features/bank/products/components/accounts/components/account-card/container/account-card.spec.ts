import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountCardComponent } from './account-card';
import { AccountType } from '../../../../../../../../shared/models/accounts/accounts.model';

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  const mockAccount = {
    id: '1',
    userId: 'user1',
    permission: 1,
    accountNumber: '1234567890',
    friendlyName: 'Test Account',
    type: AccountType.current,
    balance: 1000,
    currency: 'USD',
    iban: 'DE89370400440532013000',
    name: 'Test Account',
    status: 'active',
    isActive: true,
    createdAt: '2024-01-01',
    openedAt: '2024-01-01',
    closedAt: '',
    isFavorite: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', mockAccount);
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

  it('should compute accountIcon from account type', () => {
    expect(component['accountIcon']()).toBe('/images/svg/account/wallet.svg');
  });

  it('should compute formattedBalance from account balance', () => {
    const formatted = component['formattedBalance']();
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });

  it('should compute formattedDate from account createdAt', () => {
    const formatted = component['formattedDate']();
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });
});
