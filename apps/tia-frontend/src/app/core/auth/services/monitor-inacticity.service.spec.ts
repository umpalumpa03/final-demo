import { TestBed } from '@angular/core/testing';
import { MonitorInactivity } from './monitor-inacticity.service';
import { TokenService } from './token.service';
import { vi } from 'vitest';

describe('MonitorInactivity', () => {
  it('creates service and exposes timeleft/timeWarning', () => {
    const tokenMock = { accessToken: 'token' };

    TestBed.configureTestingModule({
      providers: [
        MonitorInactivity,
        { provide: TokenService, useValue: tokenMock },
      ],
    });

    const svc = TestBed.inject(MonitorInactivity);
    expect(svc).toBeTruthy();
    expect(svc.timeleft()).toBe(0);
    expect(svc.timeWarning()).toBe(0);
  });

  it('emits countdown on inactivity$ and updates timeleft/timeWarning', () => {
    vi.useFakeTimers();

    const tokenMock = { accessToken: 'token' };

    TestBed.configureTestingModule({
      providers: [
        MonitorInactivity,
        { provide: TokenService, useValue: tokenMock },
      ],
    });

    const svc = TestBed.inject(MonitorInactivity) as any;

    svc.inactivityThreshold = 10;
    svc.warningThreshold = 2;
    svc.totalInactivityTime$.next(2000); 

    const results: Array<number | boolean> = [];
    const sub = svc.inactivity$.subscribe((v: any) => results.push(v));

    document.dispatchEvent(new Event('mousemove'));

    vi.advanceTimersByTime(600);

    vi.advanceTimersByTime(0);
    expect(svc.timeleft()).toBe(2);
    expect(svc.timeWarning()).toBe(2);

    vi.advanceTimersByTime(1000);
    expect(svc.timeleft()).toBe(1);
    expect(svc.timeWarning()).toBe(1);

    vi.advanceTimersByTime(1000);
    expect(svc.timeleft()).toBe(0);

    expect(results[0]).toBe(2);
    expect(results[1]).toBe(1);
    expect(results[2]).toBe(true);

    sub.unsubscribe();
    vi.useRealTimers();
  });
});
