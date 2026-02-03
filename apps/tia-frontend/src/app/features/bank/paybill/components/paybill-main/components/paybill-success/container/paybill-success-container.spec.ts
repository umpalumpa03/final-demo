import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillSuccessContainer } from './paybill-success-container';

describe('PaybillSuccessContainer', () => {
  let component: PaybillSuccessContainer;
  let fixture: ComponentFixture<PaybillSuccessContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillSuccessContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillSuccessContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
