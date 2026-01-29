import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordVerify } from './forgot-password-verify';

describe('ForgotPasswordVerify', () => {
  let component: ForgotPasswordVerify;
  let fixture: ComponentFixture<ForgotPasswordVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordVerify],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordVerify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
