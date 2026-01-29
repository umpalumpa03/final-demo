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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
