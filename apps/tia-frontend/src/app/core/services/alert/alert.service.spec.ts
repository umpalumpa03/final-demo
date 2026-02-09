import { TestBed } from '@angular/core/testing';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let routerEvents$: Subject<RouterEvent>;

  beforeEach(() => {
    vi.useFakeTimers();
    routerEvents$ = new Subject<RouterEvent>();

    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: Router, useValue: { events: routerEvents$.asObservable() } },
      ],
    });

    service = TestBed.inject(AlertService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created with default state', () => {
    expect(service).toBeTruthy();
    expect(service.isVisible()).toBe(false);
    expect(service.alertType()).toBeNull();
    expect(service.alertMessage()).toBe('');
    expect(service.alertTitle()).toBe('');
    expect(service.alertVariant()).toBe('standard');
  });

  it('should show success alert with options', () => {
    service.success('Done', { variant: 'dismissible', title: 'Success!' });

    expect(service.isVisible()).toBe(true);
    expect(service.alertType()).toBe('success');
    expect(service.alertMessage()).toBe('Done');
    expect(service.alertVariant()).toBe('dismissible');
    expect(service.alertTitle()).toBe('Success!');
  });

  it('should show error alert', () => {
    service.error('Failed', { variant: 'dismissible', title: 'Oops!' });

    expect(service.alertType()).toBe('error');
    expect(service.alertMessage()).toBe('Failed');
  });

  it('should auto-hide after default timeout', () => {
    service.error('Failed');
    expect(service.isVisible()).toBe(true);

    vi.advanceTimersByTime(5000);
    expect(service.isVisible()).toBe(false);
  });

  it('should reset timer when new alert overrides previous', () => {
    service.success('First');
    vi.advanceTimersByTime(3000);

    service.error('Second');
    vi.advanceTimersByTime(3000);
    expect(service.isVisible()).toBe(true);

    vi.advanceTimersByTime(2000);
    expect(service.isVisible()).toBe(false);
  });

  it('should clear alert on NavigationStart', () => {
    service.error('Error');
    routerEvents$.next(new NavigationStart(1, '/other'));

    expect(service.isVisible()).toBe(false);
  });
});
