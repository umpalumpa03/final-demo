import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { UserActivityService } from './user-activity.service';

describe('UserActivityService', () => {
  let service: UserActivityService;
  const ngZoneStub = {
    runOutsideAngular: (fn: Function) => fn(),
    run: (fn: Function) => fn(),
  } as unknown as NgZone;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        UserActivityService,
        { provide: NgZone, useValue: ngZoneStub },
      ],
    });

    service = TestBed.inject(UserActivityService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('startMonitoring schedules idle and emits true after timeout', async () => {
    const emissions: boolean[] = [];
    service.idle$.subscribe((v) => emissions.push(v));

    service.setIdleTimeout(0.001); // ~60ms
    service.startMonitoring();

    expect(service.getIdleStatus()).toBe(false);

    // advance beyond timeout
    vi.advanceTimersByTime(70);
    await Promise.resolve();

    expect(service.getIdleStatus()).toBe(true);
    expect(emissions.includes(true)).toBe(true);
  });

  it('stopMonitoring cancels idle timer', async () => {
    const emissions: boolean[] = [];
    service.idle$.subscribe((v) => emissions.push(v));

    service.setIdleTimeout(0.001);
    service.startMonitoring();
    service.stopMonitoring();

    vi.advanceTimersByTime(2000);
    await Promise.resolve();

    expect(service.getIdleStatus()).toBe(false);
    expect(emissions).toEqual([]);
  });

  it('setIdleTimeout updates timeout and resets timer when active', async () => {
    const emissions: boolean[] = [];
    service.idle$.subscribe((v) => emissions.push(v));

    service.setIdleTimeout(0.002); // 120ms
    service.startMonitoring();

    // advance a bit then change timeout to shorter value
    vi.advanceTimersByTime(50);
    service.setIdleTimeout(0.001); // 60ms and should reset

    vi.advanceTimersByTime(70);
    await Promise.resolve();

    expect(service.getIdleStatus()).toBe(true);
    expect(emissions.includes(true)).toBe(true);
  });

  it('getTimeUntilIdle returns a non-negative number', () => {
    service.setIdleTimeout(0.01); // 600ms
    service.startMonitoring();

    const timeUntil = service.getTimeUntilIdle();
    expect(typeof timeUntil).toBe('number');
    expect(timeUntil).toBeGreaterThanOrEqual(0);
  });
});
