import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillFormContainer } from './paybill-form-container';

describe('PaybillFormContainer', () => {
  let component: PaybillFormContainer;
  let fixture: ComponentFixture<PaybillFormContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillFormContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillFormContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
