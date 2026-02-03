import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, EventEmitter, Output, Input } from '@angular/core';
import { PaybillFormContainer } from './paybill-form-container';
import { PaybillForm } from '../components/paybill-form-items/paybill-form';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { vi, describe, it, expect, beforeEach } from 'vitest';

@Component({
  selector: 'app-paybill-form',
  template: '',
  standalone: true,

  inputs: ['provider', 'verifiedDetails', 'iconBgColor', 'iconBgPath'],
})
class MockPaybillFormComponent {
  @Output() verify = new EventEmitter<any>();
  @Output() pay = new EventEmitter<any>();
}

describe('PaybillFormContainer', () => {
  let component: PaybillFormContainer;
  let fixture: ComponentFixture<PaybillFormContainer>;
  let mockFacade: any;

  beforeEach(async () => {
    mockFacade = {
      activeProvider: signal({ name: 'Test', id: '1' }),
      verifiedDetails: signal(null),
      activeCategoryUI: signal({ iconBgColor: '#fff', iconBgPath: '' }),
      verifyAccount: vi.fn(),
      proceedToPayment: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillFormContainer],
      providers: [{ provide: PaybillMainFacade, useValue: mockFacade }],
    })

      .overrideComponent(PaybillFormContainer, {
        remove: { imports: [PaybillForm] },
        add: { imports: [MockPaybillFormComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaybillFormContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call verifyAccount on facade when child emits verify event', () => {
    const childDebugElement =
      fixture.debugElement.nativeElement.querySelector('app-paybill-form');

    const eventData = { value: '123' };
    component.onVerifyAccount(eventData as any);

    expect(mockFacade.verifyAccount).toHaveBeenCalledWith('123');
  });
});
