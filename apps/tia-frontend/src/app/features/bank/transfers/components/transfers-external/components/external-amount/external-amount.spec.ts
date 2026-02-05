import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalAmount } from './external-amount';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { TransfersApiService } from '../../../../services/transfersApi.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('ExternalAmount', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;
  let mockExternalService: any;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    mockStore = {
      isLoading: signal(false),
      isFeeLoading: signal(false),
      fee: signal(0),
      totalWithFee: signal(0),
      senderAccount: signal({ id: 'a1', currency: 'GEL', balance: 1000 }),
      selectedRecipientAccount: signal({ id: 'r1', name: 'John Doe' }),
      manualRecipientName: signal(''),
      recipientInfo: signal(null),
      recipientType: signal('phone'),
      amount: signal(0),
      description: signal(''),
      hasInsufficientBalance: signal(false),
      requiresOtp: signal(false),
      transferSuccess: signal(false),
      error: signal(''),
      setError: vi.fn(),
      setAmount: vi.fn(),
      setInsufficientBalance: vi.fn(),
      setLoading: vi.fn(),
      updateFeeInfo: vi.fn(),
      setDescription: vi.fn(),
      setManualRecipientName: vi.fn(),
      setSelectedRecipientAccount: vi.fn(),
      setSenderAccount: vi.fn(),
      setRequiresOtp: vi.fn(),
      reset: vi.fn(),
    };

    mockExternalService = {
      handleAmountGoBack: vi.fn(),
      handleSameBankTransfer: vi.fn(),
      handleOtherBankTransfer: vi.fn(),
      handleAmountInput: vi.fn(),
      verifyTransfer: vi.fn(),
    };

    const mockBreakpoint = { isMobile: signal(false) };

    await TestBed.configureTestingModule({
      imports: [ExternalAmount, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TransferStore, useValue: mockStore },
        { provide: BreakpointService, useValue: mockBreakpoint },
        { provide: TransfersApiService, useValue: { getFee: vi.fn() } },
        { provide: Router, useValue: mockRouter },
      ],
    })
      .overrideComponent(ExternalAmount, {
        set: {
          providers: [
            { provide: TransferExternalService, useValue: mockExternalService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
  });

  it('should call handleAmountInput on value change', () => {
    fixture.detectChanges();
    component.amountInput.setValue('50');
    expect(mockExternalService.handleAmountInput).toHaveBeenCalledWith(50);
  });

  it('should handle onGoBack', () => {
    component.amountInput.setValue('100');
    component.descriptionInput.setValue('Rent');
    component.onGoBack();
    expect(mockExternalService.handleAmountGoBack).toHaveBeenCalledWith(
      100,
      'Rent',
    );
  });

  it('should handle onTransfer for same bank', () => {
    mockStore.recipientType.set('phone');
    component.amountInput.setValue('100');
    component.onTransfer();
    expect(mockExternalService.handleSameBankTransfer).toHaveBeenCalled();
  });

  it('should handle onTransfer for other bank', () => {
    mockStore.recipientType.set('iban-different-bank');
    component.amountInput.setValue('100');
    component.onTransfer();
    expect(mockExternalService.handleOtherBankTransfer).toHaveBeenCalled();
  });

  it('should handle OTP actions', () => {
    component.onOtpClose();
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(false);

    component.onOtpVerify('123456');
    expect(mockExternalService.verifyTransfer).toHaveBeenCalledWith('123456');
  });
  it('should compute recipient initials correctly', () => {
    mockStore.recipientType.set('phone');
    mockStore.recipientInfo.set({ fullName: 'Mariam Svanidze' });
    fixture.detectChanges();
    expect(component.recipientInitials()).toBe('MS');
    mockStore.recipientType.set('iban-different-bank');
    mockStore.manualRecipientName.set('John Doe');
    fixture.detectChanges();
    expect(component.recipientInitials()).toBe('JD');
  });
});
