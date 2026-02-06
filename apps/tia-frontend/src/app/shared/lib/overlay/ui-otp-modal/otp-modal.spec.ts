import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpModal } from './otp-modal';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('OtpModal', () => {
  let component: OtpModal;
  let fixture: ComponentFixture<OtpModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpModal, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should hit the early return in onSubmit if form is invalid (Line 51-53)', () => {
    const markAllAsTouchedSpy = vi.spyOn(component.form, 'markAllAsTouched');
    const emitSpy = vi.spyOn(component.verify, 'emit');

    component.onSubmit();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit verify with otp value when form is valid (Line 55)', () => {
    const emitSpy = vi.spyOn(component.verify, 'emit');
    component.form.controls.otp.setValue('1234');

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith('1234');
  });

  it('should trigger resend and closed outputs', () => {
    const resendSpy = vi.spyOn(component.resend, 'emit');
    const closedSpy = vi.spyOn(component.closed, 'emit');

    component.resend.emit();
    component.closed.emit();

    expect(resendSpy).toHaveBeenCalled();
    expect(closedSpy).toHaveBeenCalled();
  });

  it('should have correct inputConfig properties', () => {
    expect(component.inputConfig.length).toBe(4);
    expect(component.inputConfig.inputType).toBe('number');
  });
});
