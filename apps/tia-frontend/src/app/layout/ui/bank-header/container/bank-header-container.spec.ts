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
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  const mockNotificationsService = {
    userSignIn: vi.fn(() => of({ challengeId: 'mock-id' })),
    mfaVerification: vi.fn(() => of({ access_token: 'mock-token' })),
    hasUnreadNotification: vi.fn(() => of({ hasUnread: true })),
    getNotifications: vi.fn(() => of({ data: [] })),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
      providers: [
        { provide: Notifications, useValue: mockNotificationsService },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run the temporary auth flow on init', () => {
    fixture.detectChanges();

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
