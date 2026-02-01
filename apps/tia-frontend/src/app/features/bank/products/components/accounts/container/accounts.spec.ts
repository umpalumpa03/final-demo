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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadAccounts on ngOnInit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture.detectChanges();
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

  it('should dispatch updateFriendlyName on handleRenameAccount', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleRenameAccount({
      accountId: 'acc-123',
      friendlyName: 'New Name',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
