import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillFormDetails } from './paybill-form-details';

describe('PaybillFormDetails', () => {
  let component: PaybillFormDetails;
  let fixture: ComponentFixture<PaybillFormDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillFormDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillFormDetails);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('details', {
      valid: true,
      accountHolder: 'John Doe',
      amountDue: 50,
      dueDate: '2025-12-31',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
