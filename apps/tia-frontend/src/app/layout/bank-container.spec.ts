import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { BankContainer } from './bank-container';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('BankContainer', () => {
  let component: BankContainer;
  let fixture: ComponentFixture<BankContainer>;

  // Create a minimal mock to satisfy the child component (BankHeaderContainer)
  const mockNotificationsService = {
    userSignIn: vi.fn(() => of({ challengeId: 'mock' })),
    mfaVerification: vi.fn(() => of({ access_token: 'mock' })),
    hasUnreadNotification: vi.fn(() => of({ hasUnread: false })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankContainer],
      providers: [
        provideRouter([]),
        // Add these to catch any leaked HTTP calls from children
        provideHttpClient(),
        provideHttpClientTesting(),
        // Provide the mock so BankHeaderContainer doesn't use the real service
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankContainer);
    component = fixture.componentInstance;

    // detectChanges triggers the child's ngOnInit, which is where the HTTP call lives
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
