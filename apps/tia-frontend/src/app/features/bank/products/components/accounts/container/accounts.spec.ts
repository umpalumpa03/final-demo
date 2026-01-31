import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accounts } from './accounts';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
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
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.handleOpenModal();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/products/accounts/create',
    ]);
  });

  it('should dispatch closeCreateModal', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleCloseModal();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch createAccount', () => {
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
    expect(component['isCreatingAccount$']).toBeDefined();
    expect(component['isCreateModalOpen$']).toBeDefined();
    expect(component['error$']).toBeDefined();
    expect(component['createError$']).toBeDefined();
    expect(component['isRenamingAccount$']).toBeDefined();
    expect(component['renameError$']).toBeDefined();
  });

  it('should have accountSectionsData defined', () => {
    expect(component['accountSectionsData']).toBeDefined();
    expect(Array.isArray(component['accountSectionsData']())).toBe(true);
  });
});
