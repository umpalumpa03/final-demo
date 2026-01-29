import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillOtpVerification } from './paybill-otp-verification';

describe('PaybillOtpVerification', () => {
  let component: PaybillOtpVerification;
  let fixture: ComponentFixture<PaybillOtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillOtpVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillOtpVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
