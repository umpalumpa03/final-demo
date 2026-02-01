import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed();

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Observable, Subscription } from 'rxjs';

import { OtpVerification } from './otp-verification';

describe('OtpVerification', () => {

class FakeLoader implements TranslateLoader {
	getTranslation(): Observable<any> {
		return of({});
	}
}

	let fixture: ComponentFixture<OtpVerification>;
	let component: OtpVerification;

	beforeEach(async () => {
		vi.useFakeTimers();

		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				OtpVerification,
				TranslateModule.forRoot({
					loader: { provide: TranslateLoader, useClass: FakeLoader },
				}),
			],
			providers: [provideRouter([])],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(OtpVerification);
		component = fixture.componentInstance;

		(component as any).type = () => 'sign-in';
		fixture.detectChanges();
	});

	afterEach(() => {
		vi.clearAllTimers();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should have an invalid form when empty', () => {
		expect(component.otpForm.invalid).toBe(true);
	});

	it('should not call submitMethod when form is invalid', () => {
		const submitSpy = vi.fn();
		(component as any).submitMethod = () => submitSpy;

		component.onSubmit();

		expect(submitSpy).not.toHaveBeenCalled();
	});

	it('should emit isVerifyCalled with correct value on valid submit', () => {
		const submitSpy = vi.fn().mockReturnValue(of({}));
		(component as any).submitMethod = () => submitSpy;

		const spy = vi.fn();
		component.isVerifyCalled.subscribe(spy);

		component.otpForm.get('code')?.setValue('1234');
		component.onSubmit();

		expect(spy).toHaveBeenCalledWith({ isCalled: true, otp: '1234' });
	});

	it('should emit isResendCalled when onResend is called and countdown is 0', () => {
		const spy = vi.fn();
		component.isResendCalled.subscribe(spy);

		component.countdown.set(0);
		component.onResend();

		expect(spy).toHaveBeenCalledWith(true);
	});

	it('should not emit isResendCalled if countdown is not 0', () => {
		const spy = vi.fn();
		component.isResendCalled.subscribe(spy);

		component.countdown.set(10);
		component.onResend();

		expect(spy).not.toHaveBeenCalled();
	});

	it('should emit onTimeout when countdown reaches 0', () => {
		const spy = vi.fn();
		component.onTimeout.subscribe(spy);

		component.countdown.set(0);
		vi.runOnlyPendingTimers();

		expect(spy).toHaveBeenCalled();
	});

	it('should set isResendActive true when countdown reaches 0', () => {
		component.countdown.set(0);
		vi.runOnlyPendingTimers();

		expect(component.isResendActive()).toBe(true);
	});

	it('should reset timer and set isResendActive false on startTimer', () => {
		component.isResendActive.set(true);
		component.countdown.set(0);

		(component as any).startTimer();

		expect(component.isResendActive()).toBe(false);
	});

	it('should clean up on ngOnDestroy', () => {
		const sub = new Subscription();
		const unsubSpy = vi.spyOn(sub, 'unsubscribe');

		(component as any).timerSubscription = sub;

		component.ngOnDestroy();

		expect(unsubSpy).toHaveBeenCalled();
		expect((component as any).destroy$.isStopped).toBe(true);
	});
});
