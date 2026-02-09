import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentDistribution } from './payment-distribution';

describe('PaymentDistribution', () => {
  let component: PaymentDistribution;
  let fixture: ComponentFixture<PaymentDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentDistribution],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentDistribution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
