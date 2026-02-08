import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsContainer } from './accounts-container';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsStore } from '../strore/accounts.store';

describe('AccountsContainer', () => {
  let component: AccountsContainer;
  let fixture: ComponentFixture<AccountsContainer>;

  beforeEach(async () => {
    const mockStore: Partial<Record<string, unknown>> = {
      // minimal store API used by the template
      accounts: () => [],
      loading: () => false,
      error: () => null,
      successMessage: () => null,
      loadAccounts: vi.fn(),
      favoriteLoadingIds: () => new Set(),
      visibilityLoadingIds: () => new Set(),
      changeNameLoadingIds: () => new Set(),
      toggleFavorite: vi.fn(),
      toggleVisibility: vi.fn(),
      changeFriendlyName: vi.fn(),
    };

    const mockRouter = { navigate: () => {} };
    await TestBed.configureTestingModule({
      imports: [AccountsContainer, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        // provide the mock store at the testing module level so TestBed.inject works
        { provide: AccountsStore, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    // Override the component providers so the test uses the mock AccountsStore
    TestBed.overrideComponent(AccountsContainer, {
      set: { providers: [{ provide: AccountsStore, useValue: mockStore }] },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AccountsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls store.loadAccounts on init', () => {
    const store = TestBed.inject(AccountsStore) as any;
    expect(store.loadAccounts).toHaveBeenCalled();
  });

  it('handles favorite and visibility toggles', () => {
    const store = TestBed.inject(AccountsStore) as any;
    component.handleFavorite('id-1', true);
    expect(store.toggleFavorite).toHaveBeenCalledWith({ id: 'id-1', isFavorite: true });
    component.handleVisibility('id-2', false);
    expect(store.toggleVisibility).toHaveBeenCalledWith({ id: 'id-2', isHidden: false });
  });

  it('open/close and submit change name flows', () => {
    const store = TestBed.inject(AccountsStore) as any;
    component.openChangeName('id-3', 'Friendly', 'IBAN');
    expect(component.changeNameOpen()).toBeTruthy();
    expect(component.changeNameAccountId()).toBe('id-3');
    component.submitChangeName('New Friendly');
    expect(store.changeFriendlyName).toHaveBeenCalledWith({ id: 'id-3', friendlyName: 'New Friendly' });
    component.closeChangeName();
    expect(component.changeNameOpen()).toBeFalsy();
  });

  it('navigates on backButtonClick and retries on failRetryClick', () => {
    const router = TestBed.inject(Router) as any;
    vi.spyOn(router, 'navigate');
    const store = TestBed.inject(AccountsStore) as any;
    component.backButtonClick();
    expect(router.navigate).toHaveBeenCalledWith(['bank/dashboard']);
    component.failRetryClick();
    expect(store.loadAccounts).toHaveBeenCalled();
  });
});
