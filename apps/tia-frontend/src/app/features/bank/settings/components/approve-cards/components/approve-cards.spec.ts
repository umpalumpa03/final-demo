import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveCards } from './approve-cards';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormBuilder } from '@angular/forms';
import { signal } from '@angular/core';
import { ApproveCardsState } from '../shared/state/approve-cards.state';
import { TranslateModule } from '@ngx-translate/core';

describe('ApproveCards', () => {
  let component: ApproveCards;
  let fixture: ComponentFixture<ApproveCards>;
  let storeMock: any;
  let stateMock: any;

  beforeEach(async () => {
    storeMock = {
      load: vi.fn(),
      loadPerrmisions: vi.fn(),
      updateStatus: vi.fn(),
      isLoading: signal(false),
      error: signal(null),
      success: signal(null),
      cards: signal([{ 
        id: '1', 
        nickname: 'Test Card', 
        user: { firstName: 'John', lastName: 'Doe' } 
      }]),
      permissions: signal([
        { value: 'allowAtm', displayName: 'ATM' },
        { value: 'allowOnline', displayName: 'Online' }
      ])
    };

    stateMock = {
      newConfig: signal({
        alertMessages: {
          successDesc: 'Success Message Content',
          errorDesc: 'Error Message Content'
        }
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        ApproveCards, 
        TranslateModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: ApproveCardsStore, useValue: storeMock },
        { provide: ApproveCardsState, useValue: stateMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCards);
    component = fixture.componentInstance;
  });

  it('should initialize and load only basic store data on init', () => {
    fixture.detectChanges();
    expect(storeMock.load).toHaveBeenCalled();
    expect(storeMock.loadPerrmisions).not.toHaveBeenCalled();
  });

  it('should load permissions when handlePermissions is called', () => {
    fixture.detectChanges();
    component.handleAction({ action: 'permissions', id: '1' });
    expect(storeMock.loadPerrmisions).toHaveBeenCalled();
    expect(component.permissionsOverlay()).toBe(true);
  });

  describe('alertDescription computed', () => {
    it('should return empty string when store.success is null', () => {
      storeMock.success.set(null);
      fixture.detectChanges();
      expect(component.alertDescription()).toBe('');
    });

    it('should return success description when store.success is "success"', () => {
      storeMock.success.set('success');
      fixture.detectChanges();
      expect(component.alertDescription()).toBe('Success Message Content');
    });
  });

  it('should sync FormRecord controls when permissions change via effect', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.cardPermissionsForm.contains('allowAtm')).toBe(true);
    expect(component.cardPermissionsForm.contains('allowOnline')).toBe(true);
  });

  it('should compute card name and full name correctly', () => {
    fixture.detectChanges();
    component.activeCardId.set('1');
    fixture.detectChanges();
    
    expect(component.cardName()).toBe('Test Card');
    expect(component.fullName()).toBe('John Doe');
  });

  it('should approve with permissions if card is saved', () => {
    fixture.detectChanges();
    component.activeCardId.set('1');
    component.onSavePermissions();
    
    component.cardPermissionsForm.get('allowAtm')?.setValue(true);
    component['handleApprove']('1');

    expect(storeMock.updateStatus).toHaveBeenCalledWith(expect.objectContaining({
      permissions: ['allowAtm'],
      status: 'ACTIVE'
    }));
  });

  it('should handle handleAction branching', () => {
    fixture.detectChanges();
    const permSpy = vi.spyOn(component as any, 'handlePermissions');
    const approveSpy = vi.spyOn(component as any, 'handleApprove');
    const declineSpy = vi.spyOn(component as any, 'handleDecline');

    component.handleAction({ action: 'permissions', id: '1' });
    expect(permSpy).toHaveBeenCalledWith('1');

    component.handleAction({ action: 'approve', id: '1' });
    expect(approveSpy).toHaveBeenCalledWith('1');

    component.handleAction({ action: 'decline', id: '1' });
    expect(declineSpy).toHaveBeenCalledWith('1');
  });

  it('should decline a card', () => {
    fixture.detectChanges();
    component['handleDecline']('1');
    expect(storeMock.updateStatus).toHaveBeenCalledWith({
      cardId: '1',
      status: 'CANCELLED',
      permissions: []
    });
  });

  it('should retry loading from store', () => {
    fixture.detectChanges();
    component.retryLoading();
    expect(storeMock.load).toHaveBeenCalledTimes(2);
  });

  it('should open confirm modal if switching cards with unsaved permissions', () => {
    fixture.detectChanges();
    component.permissionsSavedCard.set('old-id');
    component['handlePermissions']('new-id');
    expect(component.confirmModalActive()).toBe(true);
  });

  it('should reset state on confirm accept', () => {
    fixture.detectChanges();
    component.permissionsSavedCard.set('1');
    const permSpy = vi.spyOn(component as any, 'handlePermissions');
    (component as any).pendingId.set('2');

    component.onConfirmAccept();

    expect(component.permissionsSavedCard()).toBeNull();
    expect(component.confirmModalActive()).toBe(false);
    expect(permSpy).toHaveBeenCalledWith('2');
  });

  it('should close confirm modal on onConfirmCancel', () => {
    fixture.detectChanges();
    component.confirmModalActive.set(true);
    component.onConfirmCancel();
    expect(component.confirmModalActive()).toBe(false);
  });

  it('should clear state on cancelPermissionChanges', () => {
    fixture.detectChanges();
    component.permissionsSavedCard.set('1');
    component.activeCardId.set('1');
    component.cancelPermissionChanges();
    expect(component.permissionsSavedCard()).toBeNull();
    expect(component.permissionsOverlay()).toBe(false);
  });
});