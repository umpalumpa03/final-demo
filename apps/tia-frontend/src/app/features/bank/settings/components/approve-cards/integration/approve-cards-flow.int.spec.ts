import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApproveCardsContainer } from '../container/approve-cards-container';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { patchState } from '@ngrx/signals';
import { FormControl } from '@angular/forms';

describe('ApproveCards High Coverage Integration', () => {
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let httpMock: HttpTestingController;
  let component: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCardsContainer, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ApproveCardsContainer);
    
    fixture.detectChanges(); 
    httpMock.expectOne(r => r.url.includes('/cards/pending')).flush([]); 

    const approveDebug = fixture.debugElement.query(By.css('app-approve-cards'));
    component = approveDebug.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cover mappedPermissions and handleDecline', () => {
    patchState(component.store, { 
      permissions: [{ value: 'ATM', displayName: 'Atm Machine' }] as any 
    });
    fixture.detectChanges();
    
    expect(component.mappedPermissions()).toEqual([{ value: 'ATM', label: 'Atm Machine' }]);

    component.handleAction({ action: 'decline', id: 'c_decline' });
    const req = httpMock.expectOne(r => r.url.includes('change-card-status'));
    expect(req.request.body.status).toBe('CANCELLED');
    req.flush({});
  });

  it('should cover handleApprove with isEnabled TRUE branch', () => {
    const cardId = 'c1';
    component.activeCardId.set(cardId);
    component.permissionsSavedCard.set(cardId);
    
    component.cardPermissionsForm.addControl('VIEW', new FormControl(true));
    fixture.detectChanges();

    component.handleAction({ action: 'approve', id: cardId });
    
    const req = httpMock.expectOne(r => r.url.includes('change-card-status'));
    expect(req.request.body.permissions).toContain('VIEW');
    req.flush({});
  });

  it('should cover onSavePermissions guard (!cardId)', () => {
    component.activeCardId.set(null);
    component.onSavePermissions();
    expect(component.permissionsSavedCard()).toBeNull();

    component.activeCardId.set('valid_id');
    component.onSavePermissions();
    expect(component.permissionsSavedCard()).toBe('valid_id');
  });

  it('should cover handlePermissions overlay and implicit load', () => {
    component.permissionsSavedCard.set(null);
    component.handleAction({ action: 'permissions', id: 'c_new' });
    
    httpMock.expectOne(r => r.url.includes('/permissions')).flush([]);
    
    expect(component.activeCardId()).toBe('c_new');
    expect(component.permissionsOverlay()).toBe(true);
  });

  it('should cover computed signals fallback and alert empty branch', () => {
    component.activeCardId.set('unknown');
    fixture.detectChanges();
    expect(component.cardName()).toBe('Unknown Card');
    expect(component.fullName()).toBe('Unknown User');

    patchState(component.store, { success: null } as any);
    fixture.detectChanges();
    expect(component.alertDescription()).toBe('');
  });

  it('should cover modal navigation and state cleanup branches', () => {
    component.activeCardId.set('c1');
    component.permissionsSavedCard.set('c2');
    component.closeModal();
    expect(component.permissionsOverlay()).toBe(false);

    component.activeCardId.set('c1');
    component.permissionsSavedCard.set('c1');
    component.cancelPermissionChanges();
    expect(component.permissionsSavedCard()).toBeNull();

    component.onConfirmCancel();
    expect(component.confirmModalActive()).toBe(false);
    
    component.retryLoading();
    httpMock.expectOne(r => r.url.includes('/cards/pending')).flush([]);
  });

  it('should cover onConfirmAccept logic', () => {
    component.pendingId.set('c_pending');
    component.onConfirmAccept();
    
    httpMock.expectOne(r => r.url.includes('/permissions')).flush([]);
    expect(component.confirmModalActive()).toBe(false);
  });
});