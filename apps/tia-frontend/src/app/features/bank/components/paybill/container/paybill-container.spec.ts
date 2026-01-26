import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';

describe('PaybillContainer', () => {
  let component: PaybillContainer;
  let fixture: ComponentFixture<PaybillContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
