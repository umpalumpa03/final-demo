import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpVerification } from './otp-verification';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerification, TranslateModule.forRoot()],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('type', 'sign-in');
    
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create and initialize properly', () => {
    expect(component).toBeTruthy();
    expect(component.type()).toBe('sign-in');
    expect(component.timeLimit()).toBe(1);
    expect(component.timerType()).toBe('phone');
  });

  it('should compute config properties from type input', () => {
    const config = component.config();
    expect(config).toBeDefined();
    expect(component.iconUrl()).toBeDefined();
    expect(component.title()).toBeDefined();
    expect(component.subText()).toBeDefined();
    expect(component.submitBtnName()).toBeDefined();
    expect(component.backLink()).toBeDefined();
    expect(component.backLinkText()).toBeDefined();
  });


  it('should handle different timer types', () => {
    expect(component.timerType()).toBe('phone');
    
    fixture.componentRef.setInput('timerType', 'otp');
    fixture.detectChanges();
    
    expect(component.timerType()).toBe('otp');
  });

  it('should not submit when form is invalid', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');
    
    component.onSubmit();
    
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit correct otp value on submit', () => {
    const emitSpy = vi.spyOn(component.isVerifyCalled, 'emit');
    
    component.otpForm.patchValue({ code: '9876' });
    component.onSubmit();
    
    expect(emitSpy).toHaveBeenCalledWith({
      isCalled: true,
      otp: '9876'
    });
  });
});
