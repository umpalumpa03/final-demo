import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillConfirmPayment } from './paybill-confirm-payment';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCurrentAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { TranslateModule } from '@ngx-translate/core';

describe('PaybillConfirmPayment', () => {
  let component: PaybillConfirmPayment;
  let fixture: ComponentFixture<PaybillConfirmPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillConfirmPayment, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectCurrentAccounts, value: [] }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillConfirmPayment);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('currentAccounts', []);
    fixture.componentRef.setInput('provider', { id: '1', name: 'Test' });
    fixture.componentRef.setInput('summary', {
      accountNumber: '123',
      amount: 100,
    });
    fixture.componentRef.setInput('details', { accountHolder: 'John Doe' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
