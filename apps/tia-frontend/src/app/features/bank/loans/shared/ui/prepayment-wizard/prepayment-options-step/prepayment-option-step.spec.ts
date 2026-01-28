import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrepaymentOptionStep } from './prepayment-option-step';

describe('PrepaymentOptionStep', () => {
  let component: PrepaymentOptionStep;
  let fixture: ComponentFixture<PrepaymentOptionStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrepaymentOptionStep],
    }).compileComponents();

    fixture = TestBed.createComponent(PrepaymentOptionStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
