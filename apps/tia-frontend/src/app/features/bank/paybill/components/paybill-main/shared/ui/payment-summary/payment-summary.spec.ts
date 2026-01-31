import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentSummary } from './payment-summary';

describe('PaymentSummary', () => {
  let component: PaymentSummary;
  let fixture: ComponentFixture<PaymentSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSummary);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('serviceName', 'Test Service');
    fixture.componentRef.setInput('accountNumber', '123456');
    fixture.componentRef.setInput('amount', 123.45);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
