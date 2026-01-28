import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountCardComponent } from './account-card';

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;

  const mockAccount = {
    id: '1',
    accountNumber: '1234567890',
    accountName: 'Test Account',
    type: 'current',
    balance: 1000,
    currency: 'USD',
    isActive: true,
    createdAt: '2024-01-01',
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
  // it('should format currency correctly', () => {
  //   const formatted = component.formatCurrency(1000.5);
  //   expect(formatted).toBe('1,000.50');
  // });

  // it('should format currency with zero decimal places', () => {
  //   const formatted = component.formatCurrency(1000);
  //   expect(formatted).toBe('1,000.00');
  // });

  // it('should format date correctly', () => {
  //   const formatted = component.formatDate('2024-01-15');
  //   expect(formatted).toContain('01');
  //   expect(formatted).toContain('15');
  //   expect(formatted).toContain('2024');
  // });

  // it('should return correct icon for current account type', () => {
  //   const icon = component.getAccountIcon('current');
  //   expect(icon).toBe('./images/svg/account/wallet.svg');
  // });

  // it('should return correct icon for saving account type', () => {
  //   const icon = component.getAccountIcon('saving');
  //   expect(icon).toBe('./images/svg/account/piggy-bank.svg');
  // });

  // it('should return correct icon for card account type', () => {
  //   const icon = component.getAccountIcon('card');
  //   expect(icon).toBe('./images/svg/account/building.svg');
  // });

  // it('should return default icon for unknown account type', () => {
  //   const icon = component.getAccountIcon('unknown');
  //   expect(icon).toBe('./images/svg/account/wallet.svg');
  // });
});
