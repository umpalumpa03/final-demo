import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BankHeaderContainer } from './bank-header-container';
import { Notifications } from '../service/notifications';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;

  // 1. Create a stable mock object
  const mockNotificationsService = {
    userSignIn: vi.fn(() => of({ challengeId: 'mock-id' })),
    mfaVerification: vi.fn(() => of({ access_token: 'mock-token' })),
    hasUnreadNotification: vi.fn(() => of({ hasUnread: true })),
    getNotifications: vi.fn(() => of({ data: [] })),
  };

  beforeEach(async () => {
    // Reset mocks before each test
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
      providers: [
        // 2. Force the mock service
        { provide: Notifications, useValue: mockNotificationsService },
        provideRouter([]),
        // 3. These two lines prevent real HTTP calls
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Clear localStorage to prevent "leakage" between tests
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run the temporary auth flow on init', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    fixture.detectChanges(); // Calls ngOnInit

    expect(mockNotificationsService.userSignIn).toHaveBeenCalled();
    expect(mockNotificationsService.mfaVerification).toHaveBeenCalled();
    expect(setItemSpy).toHaveBeenCalledWith('JWT-Token', 'mock-token');
  });

  it('should set hasUnread signal on init', () => {
    fixture.detectChanges();
    expect(component.hasUnread()).toBe(true);
  });

  it('should handle notification click', () => {
    const mockEl = { nativeElement: {} } as ElementRef;

    component.onNotificationClick(mockEl);

    expect(component.anchorEl()).toBe(mockEl);
    expect(component.isModalOpen()).toBe(true);
    expect(mockNotificationsService.getNotifications).toHaveBeenCalled();
  });

  it('should cleanup on destroy', () => {
    const nextSpy = vi.spyOn(component.destroyRef$, 'next');
    const completeSpy = vi.spyOn(component.destroyRef$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
