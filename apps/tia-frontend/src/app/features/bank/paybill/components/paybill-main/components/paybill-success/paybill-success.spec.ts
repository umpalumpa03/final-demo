import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillSuccess } from './paybill-success';

describe('PaybillSuccess', () => {
  let component: PaybillSuccess;
  let fixture: ComponentFixture<PaybillSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
