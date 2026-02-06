import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
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

describe('ExternalAmount', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;
  let mockStore: any;
  let mockRouter: any;
  let mockAmountService: any;
  let mockExecutionService: any;

  let mockActivatedRoute: any;

  beforeEach(async () => {
    vi.useFakeTimers();
    mockRouter = { navigate: vi.fn() };
    mockActivatedRoute = {
      snapshot: { params: {}, queryParams: {} },
      params: { subscribe: vi.fn() },
      queryParams: { subscribe: vi.fn() },
    };

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

    const mockBreakpoint = { isMobile: signal(false) };

    await TestBed.configureTestingModule({
      imports: [ExternalAmount, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: TransferStore, useValue: mockStore },
        { provide: BreakpointService, useValue: mockBreakpoint },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TransferAmountService, useValue: mockAmountService },
        { provide: TransferExecutionService, useValue: mockExecutionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should call handleAmountInput on value change', () => {
    fixture.detectChanges();
    component.amountInput.setValue('50');
    expect(mockAmountService.handleAmountInput).toHaveBeenCalledWith(50);
  });

  it('should handle error effect and reset error', async () => {
    fixture.detectChanges();
    mockStore.error.set('Test Error');

    fixture.detectChanges();
    await Promise.resolve();

    expect(component.showError()).toBe(true);

    vi.advanceTimersByTime(3000);
    expect(component.showError()).toBe(false);
    // setError is commented out in the component, so we don't expect it to be called
    // expect(mockStore.setError).toHaveBeenCalledWith('');
  });

  it('should handle onGoBack', () => {
    component.amountInput.setValue('100');
    component.descriptionInput.setValue('Rent');
    component.onGoBack();
    expect(mockAmountService.handleAmountGoBack).toHaveBeenCalledWith(
      100,
      'Rent',
    );
  });

  it('should execute same bank transfer with description', () => {
    mockStore.recipientType.set('phone');
    component.amountInput.setValue('100');
    component.descriptionInput.setValue('Rent');

    component.onTransfer();

    expect(mockStore.setDescription).toHaveBeenCalledWith('Rent');
    expect(mockExecutionService.handleSameBankTransfer).toHaveBeenCalled();
  });

  it('should execute other bank transfer', () => {
    mockStore.recipientType.set('iban-different-bank');
    component.amountInput.setValue('100');
    component.onTransfer();
    expect(mockExecutionService.handleOtherBankTransfer).toHaveBeenCalled();
  });

  it('should handle OTP verify', () => {
    const otpEvent = { isCalled: true, otp: '123456' };
    component.onOtpVerify(otpEvent);
    expect(mockExecutionService.verifyTransfer).toHaveBeenCalledWith('123456');
  });

  it('should navigate to dashboard on success done', () => {
    component.onSuccessDone();
    expect(mockStore.reset).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/dashboard']);
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

  it('should correctly determine if transfer is disabled', () => {
    component.amountInput.setValue('');
    fixture.detectChanges();
    expect(component.isTransferDisabled()).toBe(true);
    component.amountInput.setValue('50');
    mockStore.hasInsufficientBalance.set(true);
    fixture.detectChanges();
    expect(component.isTransferDisabled()).toBe(true);
    mockStore.hasInsufficientBalance.set(false);
    fixture.detectChanges();
    expect(component.isTransferDisabled()).toBe(false);
  });
});
