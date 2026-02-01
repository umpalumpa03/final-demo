import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillSuccess } from './paybill-success';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('PaybillSuccess', () => {
  let component: PaybillSuccess;
  let fixture: ComponentFixture<PaybillSuccess>;

  const mockItems = [
    { label: 'Transaction ID', value: 'TXN-777' },
    { label: 'Total Amount', value: '150 GEL', isTotal: true },
  ];
  const mockTitle = 'United Water Georgian';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillSuccess);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('items', mockItems);
    fixture.componentRef.setInput('headerTitle', mockTitle);
    fixture.componentRef.setInput('iconBgColor', '#4CAF50');
    fixture.componentRef.setInput('iconBgPath', 'assets/icons/water.svg');

    fixture.detectChanges();
  });

  it('should initialize and satisfy required signal inputs', () => {
    expect(component).toBeTruthy();
  });

  it('should propagate data to the payment summary presentational component', () => {
    const summaryDebugEl = fixture.debugElement.query(
      By.css('app-payment-summary'),
    );
    const summaryInstance = summaryDebugEl.componentInstance;
    expect(summaryInstance.items()).toEqual(mockItems);
    expect(summaryInstance.headerTitle()).toBe(mockTitle);
  });

  it('should dispatch payAnother event on primary action trigger', () => {
    const emitSpy = vi.spyOn(component.payAnother, 'emit');
    const buttons = fixture.debugElement.queryAll(By.css('app-button'));
    const primaryBtn = buttons.find((btn) =>
      btn.nativeElement.textContent.includes('Pay Another'),
    );

    primaryBtn?.triggerEventHandler('click', null);
    expect(emitSpy).toHaveBeenCalled();
  });
});
