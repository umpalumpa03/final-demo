import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApproveCardsContainer } from '../container/approve-cards-container';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { ApproveCardsState } from '../shared/state/approve-cards.state';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { provideMockStore } from '@ngrx/store/testing';

describe('Modals and Overlays Integration', () => {
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let component: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ApproveCardsContainer, 
        TranslateModule.forRoot(), 
      ],
      providers: [
         { provide: 'BrowserAnimations', useValue: {} },
        provideHttpClient(), 
        provideHttpClientTesting(),
        provideMockStore({}),
        ApproveCardsState,
        ApproveCardsStore
      ]
    })
    .overrideComponent(ApproveCardsContainer, {
      set: {
        providers: [ApproveCardsState, ApproveCardsStore]
      }
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ApproveCardsContainer);
    fixture.detectChanges();

    const req = httpMock.expectOne(r => r.url.includes('/cards/pending'));
    req.flush([]);

    const approveDebug = fixture.debugElement.query(By.css('app-approve-cards'));
    component = approveDebug.componentInstance;
  });

  it('should open confirm modal when trying to switch card with unsaved permissions', () => {
    component.permissionsSavedCard.set('card-1');
    
    component.handleAction({ action: 'permissions', id: 'card-2' });
    
    const permReq = httpMock.expectOne(r => r.url.includes('/permissions'));
    permReq.flush([]);

    fixture.detectChanges();

    expect(component.confirmModalActive()).toBe(true);
  });
});