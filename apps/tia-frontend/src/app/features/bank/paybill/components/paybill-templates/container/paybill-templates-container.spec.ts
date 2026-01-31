import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplatesContainer } from './paybill-templates-container';

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let fixture: ComponentFixture<PaybillTemplatesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillTemplatesContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
