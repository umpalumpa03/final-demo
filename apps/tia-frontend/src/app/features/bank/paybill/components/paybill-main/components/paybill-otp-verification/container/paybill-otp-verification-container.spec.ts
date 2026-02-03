import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillOtpVerificationContainer } from './paybill-otp-verification-container';

describe('PaybillOtpVerificationContainer', () => {
  let component: PaybillOtpVerificationContainer;
  let fixture: ComponentFixture<PaybillOtpVerificationContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillOtpVerificationContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillOtpVerificationContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
