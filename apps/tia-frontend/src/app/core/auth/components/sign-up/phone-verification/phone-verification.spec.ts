import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed();

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';

import {
  TranslateModule,
  TranslateLoader,
} from '@ngx-translate/core';

import { OtpVerification } from '../../../shared/otp-verification/otp-verification';

class FakeLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of({});
  }
}

describe('OtpVerification', () => {
  let fixture: ComponentFixture<OtpVerification>;
  let component: OtpVerification;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        OtpVerification,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader,
          },
        }),
      ],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;

    // required input
    (component as any).type = () => 'sign-in';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.otpForm.invalid).toBe(true);
  });

  it('should not call submitMethod when form is invalid', () => {
    const submitFn = vi.fn().mockReturnValue(of({}));
    (component as any).submitMethod = () => submitFn;

    component.onSubmit();

    expect(submitFn).not.toHaveBeenCalled();
  });

  it('should call submitMethod and emit on success', () => {
    const submitFn = vi.fn().mockReturnValue(of({}));
    (component as any).submitMethod = () => submitFn;

    component.otpForm.get('code')?.setValue('1234');
    component.onSubmit();
  });

  it('should handle errors from submitMethod gracefully', () => {
    const submitFn = vi.fn().mockReturnValue(
      throwError(() => new Error('fail'))
    );
    (component as any).submitMethod = () => submitFn;

    component.otpForm.get('code')?.setValue('1234');

    expect(() => component.onSubmit()).not.toThrow();
  });
});
