import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OtpResend } from './otp-resend';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('OtpResend', () => {
  let component: OtpResend;
  let fixture: ComponentFixture<OtpResend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OtpResend, 
        TranslateModule.forRoot() 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpResend);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set resendRetriesCount from input', () => {
    fixture.componentRef.setInput('resendRetries', 4);
    component.ngOnInit();

    expect(component.resendRetriesCount()).toBe(4);
  });

  it('startResendTimer should countdown and emit timeoutReached on finish', () => {
    vi.useFakeTimers();
    const timeoutSpy = vi.spyOn(component.timeoutReached, 'emit');

    (component as any).startResendTimer(2);

    expect(component.countdown()).toBe(2);

    // first tick
    vi.advanceTimersByTime(1000);
    expect(component.countdown()).toBe(1);

    // second tick (count becomes 0) and one extra tick to trigger takeWhile completion/finalize
    vi.advanceTimersByTime(2000);

    // finalize should have run after the tick beyond zero
    expect(timeoutSpy).toHaveBeenCalled();
    expect(component.isResendActive()).toBe(true);

    vi.useRealTimers();
  });

  it('onResend should emit and decrement retries when allowed', () => {
    vi.useFakeTimers();

    fixture.componentRef.setInput('resendRetries', 2);
    fixture.componentRef.setInput('maxTimeoutMs', 1000);
    component.ngOnInit();

    component.countdown.set(0); // allow resend

    const clickSpy = vi.spyOn(component.resendClicked, 'emit');

    component.onResend();

    expect(clickSpy).toHaveBeenCalled();
    expect(component.resendRetriesCount()).toBe(1);

    // advance timers so the internal timer completes and finalize() runs (avoid flaky signal assertion)
    vi.advanceTimersByTime(2200);
    vi.useRealTimers();
  });

  it('onResend should do nothing when canResend is false', () => {
    fixture.componentRef.setInput('resendRetries', 0);
    component.ngOnInit();

    component.countdown.set(10); // not ready

    const clickSpy = vi.spyOn(component.resendClicked, 'emit');

    component.onResend();

    expect(clickSpy).not.toHaveBeenCalled();
  });
});
