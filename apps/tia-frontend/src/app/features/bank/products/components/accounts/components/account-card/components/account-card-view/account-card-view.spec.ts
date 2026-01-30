import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCardViewComponent } from './account-card-view';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit transfer when handleTransfer is called', () => {
    const spy = vi.spyOn(component.transfer, 'emit');
    component.handleTransfer();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle rename click and save with valid name', () => {
    component.handleRenameClick();
    expect(component['isEditing']()).toBe(true);
    expect(component['newName']()).toBe('Test Account');

    const spy = vi.spyOn(component.rename, 'emit');
    component['newName'].set('New Account Name');
    component.handleSave();
    expect(spy).toHaveBeenCalledWith('New Account Name');
    expect(component['renamingAccountId']()).toBe('1');
  });

  it('should not emit rename when name is same or empty', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['newName'].set('Test Account');
    component.handleSave();
    expect(spy).not.toHaveBeenCalled();

    component['newName'].set('   ');
    component.handleSave();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should reset state when saving with same or empty name', () => {
    component['isEditing'].set(true);
    component['newName'].set('Test Account');
    component.handleSave();
    expect(component['isEditing']()).toBe(false);
    expect(component['newName']()).toBe('');
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

  it('should handle blur with valid name change', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['isEditing'].set(true);
    component['newName'].set('New Name via Blur');
    component.handleBlur();
    expect(spy).toHaveBeenCalledWith('New Name via Blur');
    expect(component['renamingAccountId']()).toBe('1');
  });

  it('should handle blur with same name', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['isEditing'].set(true);
    component['newName'].set('Test Account');
    component.handleBlur();
    expect(spy).not.toHaveBeenCalled();
    expect(component['isEditing']()).toBe(false);
    expect(component['newName']()).toBe('');
  });

  it('should handle blur with empty name', () => {
    const spy = vi.spyOn(component.rename, 'emit');
    component['isEditing'].set(true);
    component['newName'].set('   ');
    component.handleBlur();
    expect(spy).not.toHaveBeenCalled();
    expect(component['isEditing']()).toBe(false);
  });

  it('should reset editing state after successful rename', () => {
    const successSpy = vi.spyOn(component.renameSuccess, 'emit');
    component['isEditing'].set(true);
    component['renamingAccountId'].set('1');

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('isRenaming', false);
      fixture.componentRef.setInput('renameError', null);
    });
    fixture.detectChanges();

    expect(successSpy).toHaveBeenCalled();
  });

  it('should not reset editing state when there is an error', () => {
    component['isEditing'].set(true);
    component['renamingAccountId'].set('1');

    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('isRenaming', false);
      fixture.componentRef.setInput('renameError', 'Error occurred');
    });
    fixture.detectChanges();

    expect(component['isEditing']()).toBe(true);
  });
});
