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

  it('should auto-select the favorite account and emit accountChanged', () => {
    const mockAccounts = [
      { label: 'Standard', value: 'acc-1', isFavorite: false },
      { label: 'Favorite', value: 'acc-2', isFavorite: true },
    ];

    const emitSpy = vi.spyOn(component.accountChanged, 'emit');

    fixture.componentRef.setInput('currentAccounts', mockAccounts);
    fixture.detectChanges();

    expect(component.selectedAccountId()).toBe('acc-2');
    expect(emitSpy).toHaveBeenCalledWith('acc-2');
  });
});
