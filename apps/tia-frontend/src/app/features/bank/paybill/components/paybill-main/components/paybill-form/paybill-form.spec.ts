import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillForm } from './paybill-form';

describe('PaybillForm', () => {
  let component: PaybillForm;
  let fixture: ComponentFixture<PaybillForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
