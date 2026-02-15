import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExpirationTimer } from './expiration-timer';

@Component({
  template: `
    <div
      appExpirationTimer
      [maxTimer]="max"
      (expirationOutput)="onExpire()"
    ></div>
  `,
  standalone: true,
  imports: [ExpirationTimer],
})
class TestHostComponent {
  max = 3;
  onExpire = vi.fn();
}

describe('ExpirationTimer Directive (Vitest)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: ExpirationTimer;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;

    fixture.detectChanges();

    directive = fixture.debugElement
      .query(By.directive(ExpirationTimer))
      .injector.get(ExpirationTimer);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize countdown with maxTimer value', () => {
    expect(directive.expireCountdown()).toBe(3);
  });

  it('should decrement countdown every second', async () => {
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.expireCountdown()).toBe(2);

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(directive.expireCountdown()).toBe(1);
  });

  it('should emit expirationOutput when countdown reaches zero', async () => {
    vi.advanceTimersByTime(3000);

    // Flush Angular signal effects
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.onExpire).toHaveBeenCalledTimes(1);
  });

  it('should stop timer when fixture is destroyed', async () => {
    fixture.destroy();

    vi.advanceTimersByTime(5000);
    await Promise.resolve();

    expect(host.onExpire).not.toHaveBeenCalled();
  });
});
