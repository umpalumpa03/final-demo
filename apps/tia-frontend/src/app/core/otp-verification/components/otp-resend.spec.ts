import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpResend } from './otp-resend';

describe('OtpResend', () => {
  let component: OtpResend;
  let fixture: ComponentFixture<OtpResend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpResend],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpResend);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
