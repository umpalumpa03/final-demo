import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillConfirmPayment } from './paybill-confirm-payment';

describe('PaybillConfirmPayment', () => {
  let component: PaybillConfirmPayment;
  let fixture: ComponentFixture<PaybillConfirmPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillConfirmPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillConfirmPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
