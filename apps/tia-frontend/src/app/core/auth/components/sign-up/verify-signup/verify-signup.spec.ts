import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifySignup } from './verify-signup';

describe('VerifySignup', () => {
  let component: VerifySignup;
  let fixture: ComponentFixture<VerifySignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifySignup],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifySignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
