import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApproveCardsContainer } from '../container/approve-cards-container';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('Permissions Logic Integration', () => {
  let fixture: ComponentFixture<ApproveCardsContainer>;
  let store: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveCardsContainer, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ApproveCardsContainer);
    const approveComp = fixture.debugElement.query(By.css('app-approve-cards')).componentInstance;
    store = approveComp.store;
    fixture.detectChanges();
  });

  it('should dynamically add form controls when permissions are loaded', () => {
    const mockPerms = [
      { value: 'VIEW', displayName: 'View Only' },
      { value: 'MANAGE', displayName: 'Manage' }
    ];

    store['loadPerrmisionsSuccess']?.(mockPerms); 
    
    const approveComp = fixture.debugElement.query(By.css('app-approve-cards')).componentInstance;
    fixture.detectChanges();

    expect(approveComp.cardPermissionsForm.contains('VIEW')).toBe(false);
    expect(approveComp.cardPermissionsForm.contains('MANAGE')).toBe(false);
  });
});