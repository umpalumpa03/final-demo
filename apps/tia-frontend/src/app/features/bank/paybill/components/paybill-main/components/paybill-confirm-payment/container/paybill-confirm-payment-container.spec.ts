import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillConfirmPaymentContainer } from './paybill-confirm-payment-container';

describe('PaybillConfirmPaymentContainer', () => {
  let component: PaybillConfirmPaymentContainer;
  let fixture: ComponentFixture<PaybillConfirmPaymentContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillConfirmPaymentContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillConfirmPaymentContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
