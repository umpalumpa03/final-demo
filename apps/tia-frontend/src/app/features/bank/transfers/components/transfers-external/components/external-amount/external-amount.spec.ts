import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalAmount } from './external-amount';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferAmountService } from '../../services/transfer-amount.service';
import { TransferExecutionService } from '../../services/transfer-execution.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';

describe('ExternalAmount', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;
  let mockStore: any;
  let mockRouter: any;
  let mockAmountService: any;
  let mockExecutionService: any;
  let mockAlertService: any;

  beforeEach(async () => {
    vi.useFakeTimers();
    mockRouter = { navigate: vi.fn() };
    mockAlertService = { error: vi.fn(), success: vi.fn() };

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
      recipientInput: signal(''),
      hasShownAmountToast: signal(false), 
      setHasShownAmountToast: vi.fn(), 
      setError: vi.fn(),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      setRequiresOtp: vi.fn(),
      reset: vi.fn(),
    };

    mockAmountService = {
      handleAmountInput: vi.fn(),
      handleAmountGoBack: vi.fn(),
    };

    mockExecutionService = {
      handleSameBankTransfer: vi.fn(),
      handleOtherBankTransfer: vi.fn(),
      verifyTransfer: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExternalAmount, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TransferStore, useValue: mockStore },
        { provide: BreakpointService, useValue: { isMobile: signal(false) } },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} }, queryParams: of({}) },
        },
        { provide: TransferAmountService, useValue: mockAmountService },
        { provide: TransferExecutionService, useValue: mockExecutionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should call handleAmountInput when input value changes', () => {
    component.amountInput.setValue('50');
    expect(mockAmountService.handleAmountInput).toHaveBeenCalledWith(50);
  });

  it('should call alertService error on state error change', () => {
    mockStore.error.set('TRANSFER_ERROR');
    TestBed.flushEffects();
    expect(mockAlertService.error).toHaveBeenCalled();
  });

  it('should show success toast on init if not shown before', () => {
    expect(mockAlertService.success).toHaveBeenCalled();
    expect(mockStore.setHasShownAmountToast).toHaveBeenCalledWith(true);
  });

  it('should navigate back via service on onGoBack', () => {
    component.amountInput.setValue('100');
    component.descriptionInput.setValue('Gift');
    component.onGoBack();
    expect(mockAmountService.handleAmountGoBack).toHaveBeenCalledWith(
      100,
      'Gift',
    );
  });

  it('should execute Same Bank transfer logic', () => {
    mockStore.recipientType.set('phone');
    component.amountInput.setValue('100');
    component.descriptionInput.setValue('Dinner');
    component.onTransfer();
    expect(mockStore.setDescription).toHaveBeenCalledWith('Dinner');
    expect(mockExecutionService.handleSameBankTransfer).toHaveBeenCalled();
  });

  it('should execute Other Bank transfer logic', () => {
    mockStore.recipientType.set('iban-different-bank');
    component.amountInput.setValue('200');
    component.onTransfer();
    expect(mockExecutionService.handleOtherBankTransfer).toHaveBeenCalled();
  });

  it('should call verifyTransfer when OTP is verified', () => {
    component.onOtpVerify({ otp: '654321', isCalled: true });
    expect(mockExecutionService.verifyTransfer).toHaveBeenCalledWith('654321');
  });

  it('should handle success done action', () => {
    component.onSuccessDone();
    expect(mockStore.reset).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/dashboard']);
  });

  it('should compute recipient initials correctly', () => {
    mockStore.recipientType.set('phone');
    mockStore.recipientInfo.set({ fullName: 'Mariam Svanidze' });
    expect(component.recipientInitials()).toBe('MS');

    mockStore.recipientType.set('iban-different-bank');
    mockStore.manualRecipientName.set('John Doe');
    expect(component.recipientInitials()).toBe('JD');
  });

  it('should handle OTP close and attempts exhaustion', () => {
    component.onOtpClose();
    expect(mockStore.setRequiresOtp).toHaveBeenCalledWith(false);
    expect(component.noAttemptsLeft()).toBe(false);

    component.handleNoMoreAttempts();
    expect(component.noAttemptsLeft()).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(mockStore.reset).toHaveBeenCalled();
  });

  it('should disable transfer button for invalid inputs', () => {
    component.amountInput.setValue('0'); 
    expect(component.isTransferDisabled()).toBe(true);

    component.amountInput.setValue('10');
    mockStore.hasInsufficientBalance.set(true);
    expect(component.isTransferDisabled()).toBe(true);
  });
});
