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
    component.handleTransfer('acc-123');
    expect(component).toBeTruthy();
  });

  it('should dispatch updateFriendlyName on handleRenameAccount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleRenameAccount({
      accountId: 'acc-123',
      friendlyName: 'New Name',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should have all required observables defined', () => {
    expect(component['accountsGrouped$']).toBeDefined();
    expect(component['isLoading$']).toBeDefined();
    expect(component['isCreating$']).toBeDefined();
    expect(component['isCreateModalOpen$']).toBeDefined();
    expect(component['error$']).toBeDefined();
    expect(component['createError$']).toBeDefined();
    expect(component['isRenamingAccount$']).toBeDefined();
    expect(component['renameError$']).toBeDefined();
  });

  it('should have accountSectionsData defined', () => {
    expect(component['accountSectionsData']).toBeDefined();
    expect(Array.isArray(component['accountSectionsData'])).toBe(true);
  });
});
