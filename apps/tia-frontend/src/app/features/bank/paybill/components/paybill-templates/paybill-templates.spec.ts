import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillTemplates } from './paybill-templates';

describe('PaybillTemplates', () => {
  let component: PaybillTemplates;
  let fixture: ComponentFixture<PaybillTemplates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplates],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillTemplates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
