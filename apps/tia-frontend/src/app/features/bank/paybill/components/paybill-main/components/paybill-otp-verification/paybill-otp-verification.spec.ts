import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillOtpVerification } from './paybill-otp-verification';
import { vi } from 'vitest';

describe('PaybillOtpVerification', () => {
  let component: PaybillOtpVerification;
  let fixture: ComponentFixture<PaybillOtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillOtpVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillOtpVerification);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('summary', {
      accountNumber: '123',
      amount: 100,
    });
    fixture.detectChanges();
  });

  it('should emit verify with code when handleVerify is called', () => {
    const spy = vi.spyOn(component.verify, 'emit');
    component.currentCode.set('1111');
    component.handleVerify();
    expect(spy).toHaveBeenCalledWith('1111');
  });
});
