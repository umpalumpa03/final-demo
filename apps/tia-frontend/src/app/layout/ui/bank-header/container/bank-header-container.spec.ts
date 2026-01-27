import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BankHeaderContainer } from './bank-header-container';
import { Notifications } from '../service/notifications';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;

  const mockNotificationsService = {
    hasUnreadNotification: vi.fn(() => of({ hasUnread: true })),
    getNotifications: vi.fn(() => of({ data: [], meta: {} })),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call hasUnreadNotification on init', () => {
    fixture.detectChanges();
    expect(mockNotificationsService.hasUnreadNotification).toHaveBeenCalled();
  });

  it('should set hasUnread signal from service response', () => {
    fixture.detectChanges();
    expect(component.hasUnread()).toBe(true);
  });

  it('should set hasUnread to false when service returns false', () => {
    mockNotificationsService.hasUnreadNotification.mockReturnValue(
      of({ hasUnread: false }),
    );
    fixture.detectChanges();
    expect(component.hasUnread()).toBe(false);
  });

  it('should set anchorEl on notification click', () => {
    const mockEl = { nativeElement: {} } as ElementRef;
    component.onNotificationClick(mockEl);
    expect(component.anchorEl()).toBe(mockEl);
  });

  it('should toggle isModalOpen on notification click', () => {
    const mockEl = { nativeElement: {} } as ElementRef;

    expect(component.isModalOpen()).toBe(false);
    component.onNotificationClick(mockEl);
    expect(component.isModalOpen()).toBe(true);
    component.onNotificationClick(mockEl);
    expect(component.isModalOpen()).toBe(false);
  });

  it('should call getNotifications on notification click', () => {
    const mockEl = { nativeElement: {} } as ElementRef;
    component.onNotificationClick(mockEl);
    expect(mockNotificationsService.getNotifications).toHaveBeenCalled();
  });

  it('should complete destroyRef$ on destroy', () => {
    const nextSpy = vi.spyOn(component.destroyRef$, 'next');
    const completeSpy = vi.spyOn(component.destroyRef$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledWith(null);
    expect(completeSpy).toHaveBeenCalled();
  });
});
