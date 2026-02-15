import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApproveCardsContainer } from '../container/approve-cards-container';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { patchState } from '@ngrx/signals';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ApproveCardsState } from '../shared/state/approve-cards.state';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { provideMockStore } from '@ngrx/store/testing';

describe('Permissions Logic Integration', () => {
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let httpMock: HttpTestingController;
  let approveComp: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ApproveCardsContainer, 
        TranslateModule.forRoot(), 
      ],
      providers: [
        provideNoopAnimations(),
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
    httpMock.expectOne(r => r.url.includes('/cards/pending')).flush([]);

    approveComp = fixture.debugElement.query(By.css('app-approve-cards')).componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should dynamically add form controls when permissions are loaded', () => {
    const mockPerms = [
      { value: 'VIEW', displayName: 'View Only' },
      { value: 'MANAGE', displayName: 'Manage' }
    ];

    patchState(approveComp.store, { permissions: mockPerms });
    
    fixture.detectChanges();

    expect(approveComp.cardPermissionsForm.contains('VIEW')).toBe(true);
    expect(approveComp.cardPermissionsForm.contains('MANAGE')).toBe(true);
    expect(approveComp.cardPermissionsForm.get('VIEW')?.value).toBe(false);
  });
});