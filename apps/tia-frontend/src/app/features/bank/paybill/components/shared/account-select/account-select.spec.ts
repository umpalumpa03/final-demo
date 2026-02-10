import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountSelect } from './account-select';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectGelAccountOptions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AccountSelect', () => {
  let component: AccountSelect;
  let fixture: ComponentFixture<AccountSelect>;
  let store: MockStore;

  const mockAccounts = [
    { value: 'acc-1', label: 'Account 1', isFavorite: false },
    { value: 'acc-2', label: 'Account 2', isFavorite: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSelect],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectGelAccountOptions, value: mockAccounts },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSelect);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.componentRef.setInput('maxVisible', 5);

    fixture.detectChanges();
  });

  it('should create and dispatch loadAccounts on init', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
  });

  it('should automatically select the favorite account on load', () => {
    expect(component.selectedAccountId()).toBe('acc-2');
  });

  it('should emit accountChanged when handleAccountChange is called', () => {
    const emitSpy = vi.spyOn(component.accountChanged, 'emit');
    component.handleAccountChange('test-id');
    expect(emitSpy).toHaveBeenCalledWith('test-id');
  });

  it('should update selectedAccountId via model when account changes', () => {
    component.selectedAccountId.set('new-id');
    expect(component.selectedAccountId()).toBe('new-id');
  });
});
