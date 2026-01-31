import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed();
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { OtpVerification } from './otp-verification';

describe('OtpVerification', () => {
	let fixture: ComponentFixture<OtpVerification>;
	let component: OtpVerification;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, OtpVerification],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(OtpVerification);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should have an invalid form when empty', () => {
		expect(component.otpForm.invalid).toBe(true);
	});

	it('should not call submitMethod when form is invalid', () => {
		const mockFn = vi.fn(() => of({}));
		(component as any).submitMethod = () => mockFn;

		component.onSubmit();

		expect(mockFn).not.toHaveBeenCalled();
	});

	it('should call submitMethod and emit on success', () => {
		const mockFn = vi.fn(() => of({}));
		(component as any).submitMethod = () => mockFn;

		component.otpForm.get('code')?.setValue('1234');
		component.onSubmit();

		expect(mockFn).toHaveBeenCalledWith('1234');
		expect(component.isSubmitting()).toBe(false);
	});

	it('should handle errors from submitMethod gracefully', () => {
		const mockFn = vi.fn(() => throwError(() => new Error('fail')));
		(component as any).submitMethod = () => mockFn;

		component.otpForm.get('code')?.setValue('0000');

		expect(() => component.onSubmit()).not.toThrow();
		expect(mockFn).toHaveBeenCalledWith('0000');
		expect(component.isSubmitting()).toBe(false);
	});
});
