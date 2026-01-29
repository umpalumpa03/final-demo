import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accounts } from './accounts';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  CreateAccountRequest,
  AccountType,
} from '../../../../../../shared/models/accounts/accounts.model';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accounts],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadAccounts on ngOnInit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch openCreateModal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleOpenModal();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch closeCreateModal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleCloseModal();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch createAccount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const mockRequest: CreateAccountRequest = {
      friendlyName: 'Test',
      type: AccountType.current,
      currency: 'USD',
    };
    component.handleCreateAccount(mockRequest);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch loadAccounts on handleRetry', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleRetry();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should handle transfer', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.handleTransfer('acc-123');
    expect(consoleSpy).toHaveBeenCalledWith('Transfer', 'acc-123');
  });
});
