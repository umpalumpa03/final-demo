import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accounts } from './accounts';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import {
  CreateAccountRequest,
  AccountType,
} from '../../../../../../shared/models/accounts/accounts.model';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let store: MockStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accounts, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch openCreateModal on ngOnInit when URL contains /create', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(router, 'url', 'get').mockReturnValue(
      '/bank/products/accounts/create',
    );
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should navigate to create on handleOpenModal', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.handleOpenModal();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/products/accounts/create',
    ]);
  });

  it('should dispatch closeCreateModal and navigate on handleCloseModal', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleCloseModal();
    expect(dispatchSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/products/accounts']);
  });

  it('should dispatch createAccount when form is valid', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(component['accountForm'](), 'valid', 'get').mockReturnValue(true);
    const mockRequest: CreateAccountRequest = {
      friendlyName: 'Test',
      type: AccountType.current,
      currency: 'USD',
    };
    component.handleCreateAccount(mockRequest);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch selectAccount and navigate on handleTransfer', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.handleTransfer('acc-123');
    expect(dispatchSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal']);
  });

  it('should dispatch loadAccounts on handleRetry', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleRetry();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch updateFriendlyName on handleRenameAccount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleRenameAccount({
      accountId: 'acc-123',
      friendlyName: 'New Name',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should set showSuccessAlert on handleRenameSuccess', () => {
    component.handleRenameSuccess();
    expect(component['showSuccessAlert']()).toBe(true);
  });

  it('should set showCreateAlert on handleCreateAlertDismissed', () => {
    component['showCreateAlert'].set(true);
    component.handleCreateAlertDismissed();
    expect(component['showCreateAlert']()).toBe(false);
  });

  it('should dispatch loadAccounts when accounts are empty', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component['handleAccountsGrouped']({
      current: [],
      saving: [],
      card: [],
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should set showCreateAlert when isCreating transitions from true to false', () => {
    component['wasCreating'] = true;
    component['handleIsCreatingAccount'](false);
    expect(component['showCreateAlert']()).toBe(true);
  });
});
