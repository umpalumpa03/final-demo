import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCardViewComponent } from './account-card-view';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';
import { AccountType } from '../../../../../../../../../shared/models/accounts/accounts.model';
import { provideTranslateService } from '@ngx-translate/core';

describe('AccountCardViewComponent', () => {
  let component: AccountCardViewComponent;
  let fixture: ComponentFixture<AccountCardViewComponent>;

  const mockAccount = {
    id: '1',
    userId: 'user1',
    permission: 1,
    friendlyName: 'Test Account',
    type: AccountType.current,
    currency: 'USD',
    iban: 'DE89370400440532013000',
    name: 'Test Account',
    status: 'active',
    balance: 1000,
    createdAt: '2026-01-01',
    openedAt: '2026-01-01',
    closedAt: '',
    isFavorite: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardViewComponent],
      providers: [provideMockStore(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardViewComponent);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', mockAccount);
      fixture.componentRef.setInput(
        'accountIcon',
        '/images/svg/account/wallet.svg',
      );
      fixture.componentRef.setInput('formattedBalance', '1,000.00');
      fixture.componentRef.setInput('formattedDate', '01 Jan 2026');
      fixture.componentRef.setInput('isRenaming', false);
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit transfer on handleTransfer', () => {
    const spy = vi.spyOn(component.transfer, 'emit');
    component.handleTransfer();
    expect(spy).toHaveBeenCalled();
  });

  it('should compute displayName from friendlyName or name', () => {
    expect(component['displayName']()).toBe('Test Account');

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        friendlyName: '',
      });
    });
    expect(component['displayName']()).toBe('Test Account');
  });

  it('should set isEditing and newName on handleRenameClick', () => {
    component.handleRenameClick();
    expect(component['isEditing']()).toBe(true);
    expect(component['newName']()).toBe('Test Account');
  });

  it('should emit rename with new name on handleSave', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component.handleRenameClick();
    component['newName'].set('New Account Name');
    component.handleSave();
    expect(spy).toHaveBeenCalledWith('New Account Name');
  });

  it('should emit rename with new name on handleBlur', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['isEditing'].set(true);
    component['newName'].set('New Name via Blur');
    component.handleBlur();
    expect(spy).toHaveBeenCalledWith('New Name via Blur');
  });

  it('should emit renameSuccess when rename completes', () => {
    const spy = vi.spyOn(component.renameSuccess, 'emit');
    component['renamingAccountId'].set('1');
    component['isEditing'].set(true);

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('isRenaming', false);
      fixture.componentRef.setInput('renameError', null);
    });
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should focus input element on edit', () => {
    vi.useFakeTimers();
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    component['isEditing'].set(true);
    fixture.detectChanges();

    expect(setTimeoutSpy).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should set dragStart on mouseDown with left button', () => {
    const event = new MouseEvent('mousedown', { button: 0, clientX: 100 });
    component.onMouseDown(event);
    expect(component['dragStart']()).toBe(100);
  });

  it('should clear dragStart on mouseUp', () => {
    component['dragStart'].set(100);
    component.onMouseUp();
    expect(component['dragStart']()).toBeNull();
  });

  it('should show make-transfer button when account has write permission', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        permission: 2,
      });
    });
    fixture.detectChanges();
    expect(component['canMakeTransfer']()).toBe(true);
  });

  it('should hide make-transfer button when account does not have write permission', () => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', {
        ...mockAccount,
        permission: 1,
      });
    });
    fixture.detectChanges();
    expect(component['canMakeTransfer']()).toBe(false);
  });
});
