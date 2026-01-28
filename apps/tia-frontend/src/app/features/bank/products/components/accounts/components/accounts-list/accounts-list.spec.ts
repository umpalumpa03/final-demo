import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';
import { AccountsListComponent } from './accounts-list';
import { AccountType } from '../../../../../../../shared/models/accounts/accounts.model';

describe('AccountsListComponent', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;

  const mockGroupedAccounts = {
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
});
