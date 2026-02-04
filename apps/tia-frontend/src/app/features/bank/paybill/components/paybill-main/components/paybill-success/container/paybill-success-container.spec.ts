import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

import { PaybillSuccessContainer } from './paybill-success-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';

describe('PaybillSuccessContainer', () => {
  let component: PaybillSuccessContainer;
  let fixture: ComponentFixture<PaybillSuccessContainer>;
  let facadeMock: any;

  beforeEach(async () => {
    facadeMock = {
      // Logic signals
      paymentPayload: signal({ id: 'payment-1' }),

      // Template signals (to prevent TypeErrors)
      successSummaryItems: signal([]), // Added to fix the current error
      activeProvider: signal(null),
      verifiedDetails: signal({}),
      activeCategoryUI: signal({}),

      // Methods
      resetFlow: vi.fn(),
      resetToDashboard: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PaybillSuccessContainer, TranslateModule.forRoot()],
      providers: [{ provide: PaybillMainFacade, useValue: facadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillSuccessContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call resetFlow on init if paymentPayload is missing', () => {
    facadeMock.paymentPayload.set(null);
    fixture.detectChanges();

    expect(facadeMock.resetFlow).toHaveBeenCalled();
  });

  it('should NOT call resetFlow on init if paymentPayload exists', () => {
    fixture.detectChanges();

    expect(facadeMock.resetFlow).not.toHaveBeenCalled();
  });

  it('should call resetFlow when onPayAnother is triggered', () => {
    fixture.detectChanges();
    component.onPayAnother();
    expect(facadeMock.resetFlow).toHaveBeenCalledTimes(1);
  });

  it('should call resetToDashboard when onGoDashboard is triggered', () => {
    fixture.detectChanges();
    component.onGoDashboard();
    expect(facadeMock.resetToDashboard).toHaveBeenCalledTimes(1);
  });
});
