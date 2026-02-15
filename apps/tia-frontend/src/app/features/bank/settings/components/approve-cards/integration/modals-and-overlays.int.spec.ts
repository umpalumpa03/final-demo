import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApproveCardsContainer } from '../container/approve-cards-container';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('Modals and Overlays Integration', () => {
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let component: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCardsContainer, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCardsContainer);
    fixture.detectChanges();
    component = fixture.debugElement.query(By.css('app-approve-cards')).componentInstance;
  });

  it('should open confirm modal when trying to switch card with unsaved permissions', () => {
    component.permissionsSavedCard.set('card-1');
    
    component.handleAction({ action: 'permissions', id: 'card-2' });
    
    TestBed.flushEffects();
    fixture.detectChanges();

    expect(component.confirmModalActive()).toBe(true);
    const modal = fixture.nativeElement.querySelector('.confirm-dialog');
    expect(modal).toBeTruthy();
  });
});