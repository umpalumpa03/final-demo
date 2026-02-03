import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentSummary } from './payment-summary';
import { TranslateModule } from '@ngx-translate/core';

describe('PaymentSummary', () => {
  let component: PaymentSummary;
  let fixture: ComponentFixture<PaymentSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSummary,TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSummary);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('headerTitle', 'Test Summary');
    fixture.componentRef.setInput('items', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
