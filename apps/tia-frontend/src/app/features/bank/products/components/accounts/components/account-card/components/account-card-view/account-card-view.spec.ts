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

  const setAccount = (account = mockAccount) => {
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('account', account);
      fixture.componentRef.setInput(
        'accountIcon',
        '/images/svg/account/wallet.svg',
      );
      fixture.componentRef.setInput('formattedBalance', '1,000.00');
      fixture.componentRef.setInput('formattedDate', '01 Jan 2026');
      fixture.componentRef.setInput('isRenaming', false);
    });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCardViewComponent],
      providers: [provideMockStore(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardViewComponent);
    component = fixture.componentInstance;
    setAccount();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create and open transfer modal', () => {
    expect(component).toBeTruthy();
    component.handleOpenTransferModal();
    expect(component['showTransferModal']()).toBe(true);
  });

  it('should compute displayName from friendlyName or name', () => {
    expect(component['displayName']()).toBe('Test Account');
    setAccount({ ...mockAccount, friendlyName: '' });
    expect(component['displayName']()).toBe('Test Account');
  });

  it('should handle rename on save and blur', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component.handleRenameClick();
    expect(component['isEditing']()).toBe(true);
    component['newName'].set('New Account Name');
    component.handleSave();
    expect(spy).toHaveBeenCalledWith('New Account Name');
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

  it('should focus input on edit and handle mouse events', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(global, 'setTimeout');
    component['isEditing'].set(true);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    vi.useRealTimers();

    const event = new MouseEvent('mousedown', { button: 0, clientX: 100 });
    component.onMouseDown(event);
    expect(component['dragStart']()).toBe(100);
    component.onMouseUp();
    expect(component['dragStart']()).toBeNull();
  });

  it('should compute canMakeTransfer based on permission', () => {
    setAccount({ ...mockAccount, permission: 2 });
    expect(component['canMakeTransfer']()).toBe(true);
    setAccount({ ...mockAccount, permission: 1 });
    expect(component['canMakeTransfer']()).toBe(true);
    setAccount({ ...mockAccount, permission: 999 });
    expect(component['canMakeTransfer']()).toBe(false);
  });
  it('should handle permission selected and navigate to correct route', () => {
    const navigateSpy = vi.spyOn(component['router'], 'navigate');
    component.handlePermissionSelected(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal'], {
      queryParams: { accountId: '1' },
    });
    expect(component['showTransferModal']()).toBe(false);
  });

  it('should navigate to external transfer for permission 2', () => {
    const navigateSpy = vi.spyOn(component['router'], 'navigate');
    component.handlePermissionSelected(2);
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/external'], {
      queryParams: { accountId: '1' },
    });
  });
  it('should navigate to paybill for permission 8', () => {
    const navigateSpy = vi.spyOn(component['router'], 'navigate');
    component.handlePermissionSelected(8);
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/paybill'], {
      queryParams: { accountId: '1' },
    });
  });
  it('should handle rename click and set editing state', () => {
    component.handleRenameClick();
    expect(component['isEditing']()).toBe(true);
    expect(component['newName']()).toBe('Test Account');
  });

  it('should handle save with same name as current', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['newName'].set('Test Account');
    component.handleSave();
    expect(spy).not.toHaveBeenCalled();
    expect(component['isEditing']()).toBe(false);
  });
  it('should handle blur with new name', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['newName'].set('New Account Name');
    component.handleBlur();
    expect(spy).toHaveBeenCalledWith('New Account Name');
    expect(component['renamingAccountId']()).toBe('1');
  });

  it('should handle mouse move when drag is active', () => {
    const mockScrollContainer = document.createElement('div');
    mockScrollContainer.scrollLeft = 0;
    vi.spyOn(component['elementRef'].nativeElement, 'closest').mockReturnValue({
      parentElement: mockScrollContainer,
    });

    component['dragStart'].set(100);
    const event = new MouseEvent('mousemove', { clientX: 150 });
    component.onMouseMove(event);
    expect(mockScrollContainer.scrollLeft).toBe(-50);
    expect(component['dragStart']()).toBe(150);
  });
});
