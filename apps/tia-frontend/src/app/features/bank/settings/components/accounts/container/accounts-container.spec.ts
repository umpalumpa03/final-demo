import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsContainer } from './accounts-container';
import { BreakpointService } from '@tia/core/services/breakpoints/breakpoint.service';
import { AccountsStore } from '../store/accounts.store';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('AccountsContainer', () => {
  let component: AccountsContainer;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    mockStore = {
      loadAccounts: vi.fn(),
      favoriteLoadingIds: () => new Set<string>(),
      visibilityLoadingIds: () => new Set<string>(),
      changeNameLoadingIds: () => new Set<string>(),
      toggleFavorite: vi.fn(),
      toggleVisibility: vi.fn(),
      changeFriendlyName: vi.fn(),
    };

    mockRouter = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AccountsContainer,
        { provide: BreakpointService, useValue: { isXsMobile: false } },
        { provide: AccountsStore, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    component = TestBed.inject(AccountsContainer);
  });

  it('calls loadAccounts on init', () => {
    component.ngOnInit();
    expect(mockStore.loadAccounts).toHaveBeenCalled();
  });

  it('reports loading states correctly', () => {
    // set up store loading ids
    mockStore.favoriteLoadingIds = () => new Set(['fav1']);
    mockStore.visibilityLoadingIds = () => new Set(['vis1']);
    mockStore.changeNameLoadingIds = () => new Set(['chg1']);

    expect(component.isFavoriteLoading('fav1')).toBe(true);
    expect(component.isVisibilityLoading('vis1')).toBe(true);
    expect(component.isChangeNameLoading('chg1')).toBe(true);
  });

  it('handles favorite/visibility actions and navigation', () => {
    component.handleFavorite('id1', false);
    expect(mockStore.toggleFavorite).toHaveBeenCalledWith({ id: 'id1', isFavorite: false });

    component.handleVisibility('id2', true);
    expect(mockStore.toggleVisibility).toHaveBeenCalledWith({ id: 'id2', isHidden: true });

    component.backButtonClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['bank/dashboard']);
  });

  it('open/close/submit change name flow', () => {
    component.openChangeName('cid', 'Old Name', 'ACC123');
    expect(component.changeNameOpen()).toBe(true);
    expect(component.changeNameAccountId()).toBe('cid');
    expect(component.changeNameInitial()).toBe('Old Name');

    component.submitChangeName('New Name');
    expect(mockStore.changeFriendlyName).toHaveBeenCalledWith({ id: 'cid', friendlyName: 'New Name' });
    expect(component.changeNameOpen()).toBe(false);
  });

  it('retry click triggers reload', () => {
    component.failRetryClick();
    expect(mockStore.loadAccounts).toHaveBeenCalled();
  });
});

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
