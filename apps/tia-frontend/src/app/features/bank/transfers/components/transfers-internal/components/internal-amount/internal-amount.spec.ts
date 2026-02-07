import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InternalAmount } from './internal-amount';
import { Component, signal, forwardRef, Input } from '@angular/core';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferInternalService } from '../../../../services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

@Component({ selector: 'app-button', standalone: true, template: '<ng-content></ng-content>' })
class ButtonMock {
  @Input() variant?: string;
  @Input() size?: string;
  @Input() fullWidth?: boolean;
  @Input() isDisabled?: boolean;
}

@Component({
  selector: 'lib-text-input',
  standalone: true,
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputMock),
      multi: true,
    },
  ],
})
class TextInputMock implements ControlValueAccessor {
  @Input() config?: any;
  @Input() type?: string;

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private _value: any = '';

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}

@Component({ selector: 'app-alert-types-with-icons', standalone: true, template: '' })
class AlertMock {
  @Input() alertType?: string;
  @Input() alertMessage?: string;
}

@Component({ selector: 'app-success-modal', standalone: true, template: '' })
class SuccessModalMock {
  @Input() title?: string;
  @Input() description?: string;
  @Input() buttonText?: string;
  @Input() isOpen?: boolean;
}

@Component({ selector: 'app-route-loader', standalone: true, template: '' })
class RouteLoaderMock {
  @Input() variant?: string;
}

@Component({ selector: 'app-tooltip', standalone: true, template: '<ng-content></ng-content>' })
class TooltipMock {
  @Input() content?: string;
  @Input() placement?: string;
  @Input() disabled?: boolean;
}

@Component({ selector: 'app-otp-modal', standalone: true, template: '' })
class OtpModalMock {}

describe('InternalAmount', () => {
  let component: InternalAmount;
  let fixture: ComponentFixture<InternalAmount>;

  let transferServiceMock: any;
  let transferStoreMock: any;
  let routerMock: any;

  const mockSender = { currency: 'EUR', balance: 500, friendlyName: 'My Euro Account' };
  const mockReceiver = { currency: 'EUR', friendlyName: 'Receiver Account' };

  beforeEach(async () => {
    vi.useFakeTimers();

    routerMock = { navigate: vi.fn() };

    transferServiceMock = {
      handleAmountInput: vi.fn(),
      handleAmountGoBack: vi.fn(),
      handleToOwnTransfer: vi.fn(),
      handleCrossCurrencyTransfer: vi.fn(),
      fetchConversionRate: vi.fn((c1, c2, successCb) => successCb(2.0)),
    };

    transferStoreMock = {
      isLoading: signal(false),
      senderAccount: signal(mockSender),
      receiverOwnAccount: signal(mockReceiver),
      hasInsufficientBalance: signal(false),
      transferSuccess: signal(false),
      requiresOtp: signal(false),
      error: signal(''),
      amount: signal(null),
      description: signal(null),
      setAmount: vi.fn(),
      setDescription: vi.fn(),
      setError: vi.fn(),
      reset: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        InternalAmount,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: TransferStore, useValue: transferStoreMock },
        { provide: TransferInternalService, useValue: transferServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: BreakpointService, useValue: { isMobile: signal(false) } },
        DecimalPipe
      ],
    })
      .overrideComponent(InternalAmount, {
        set: {
          imports: [
            ReactiveFormsModule,
            TranslateModule,
            DecimalPipe,
            ButtonMock,
            TextInputMock,
            AlertMock,
            SuccessModalMock,
            RouteLoaderMock,
            TooltipMock,
            OtpModalMock
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(InternalAmount);
    component = fixture.componentInstance;

    fixture.detectChanges();
    vi.runAllTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Properties', () => {
    it('should correctly compute initials', () => {
      expect(component.recipientInitials()).toBe('RA');
    });

    it('should compute initials for single word name', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'EUR', friendlyName: 'Account' });
      fixture.detectChanges();
      expect(component.recipientInitials()).toBe('A');
    });

    it('should detect available balance', () => {
      expect(component.availableBalance()).toBe(500);
    });

    it('should return 0 balance when sender account is null', () => {
      transferStoreMock.senderAccount.set(null);
      fixture.detectChanges();
      expect(component.availableBalance()).toBe(0);
    });

    it('should detect conversion mode', () => {
      expect(component.isConversionMode()).toBe(false);
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();
      expect(component.isConversionMode()).toBe(true);
    });

    it('should compute currency from sender account', () => {
      expect(component.currency()).toBe('EUR');
    });

    it('should return empty string when sender account is null', () => {
      transferStoreMock.senderAccount.set(null);
      fixture.detectChanges();
      expect(component.currency()).toBe('');
    });

    it('should disable transfer when loading', () => {
      component.amountInput.setValue('50');
      transferStoreMock.isLoading.set(true);
      fixture.detectChanges();
      expect(component.isTransferDisabled()).toBe(true);
    });

    it('should disable transfer in conversion mode when destination is invalid', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();
      component.amountInput.setValue('50');
      component.destinationAmountInput.setValue('');
      fixture.detectChanges();
      expect(component.isTransferDisabled()).toBe(true);
    });
  });

  describe('Form Logic', () => {
    it('should call handleAmountInput when user types amount', () => {
      component.amountInput.setValue('100');
      expect(transferServiceMock.handleAmountInput).toHaveBeenCalledWith(100);
    });

    it('should disable transfer if form is invalid', () => {
      component.amountInput.setValue('');
      fixture.detectChanges();
      expect(component.isTransferDisabled()).toBe(true);
    });

    it('should disable transfer if balance is insufficient', () => {
      component.amountInput.setValue('100');
      transferStoreMock.hasInsufficientBalance.set(true);
      fixture.detectChanges();
      expect(component.isTransferDisabled()).toBe(true);
    });

    it('should set activeInput to source when amount changes in conversion mode', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();
      component.amountInput.setValue('100');
      expect(component.activeInput()).toBe('source');
    });

    it('should set activeInput to destination when destination amount changes', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();
      component.destinationAmountInput.setValue('200');
      expect(component.activeInput()).toBe('destination');
    });
  });

  describe('Conversion Logic', () => {
    it('should update destination amount when source changes in conversion mode', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();

      component.amountInput.setValue('100');
      expect(component.destinationAmountInput.value).toBe('200.00');
    });

    it('should update source amount when destination changes in conversion mode', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();

      component.destinationAmountInput.setValue('200');

      expect(component.amountInput.value).toBe('100.00');
    });

    it('should not update destination amount if conversion rate is 0', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();
      component.conversionRate.set(0);

      component.amountInput.setValue('100');
      expect(component.destinationAmountInput.value).toBe('');
    });

    it('should not update source amount if conversion rate is 0', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();
      component.conversionRate.set(0);

      component.destinationAmountInput.setValue('200');
      expect(component.amountInput.value).toBe('');
    });

    it('should fetch conversion rate when currencies differ', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();

      expect(transferServiceMock.fetchConversionRate).toHaveBeenCalled();
    });

    it('should handle conversion rate fetch error', () => {
      transferServiceMock.fetchConversionRate = vi.fn((c1, c2, successCb, errorCb) => {
        if (errorCb) errorCb();
      });

      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();

      expect(component.conversionRate()).toBe(0);
    });
  });

  describe('Actions', () => {
    it('should navigate back on Go Back', () => {
      component.amountInput.setValue('50');
      component.descriptionInput.setValue('Test Note');
      component.onGoBack();

      expect(transferServiceMock.handleAmountGoBack).toHaveBeenCalledWith(50, 'Test Note');
    });

    it('should handle standard transfer', () => {
      component.amountInput.setValue('50');
      component.onTransfer();

      expect(transferStoreMock.setDescription).toHaveBeenCalled();
      expect(transferServiceMock.handleToOwnTransfer).toHaveBeenCalled();
    });

    it('should handle cross currency transfer with source input', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();

      component.amountInput.setValue('50');
      component.activeInput.set('source');
      component.onTransfer();

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(50);
      expect(transferServiceMock.handleCrossCurrencyTransfer).toHaveBeenCalledWith(false);
    });

    it('should handle cross currency transfer with destination input', () => {
      transferStoreMock.receiverOwnAccount.set({ currency: 'USD' });
      fixture.detectChanges();

      component.destinationAmountInput.setValue('100');
      component.activeInput.set('destination');
      component.onTransfer();

      expect(transferStoreMock.setAmount).toHaveBeenCalledWith(100);
      expect(transferServiceMock.handleCrossCurrencyTransfer).toHaveBeenCalledWith(true);
    });
  });

  describe('Error Handling', () => {
    it('should show error toast when store has error', () => {
      transferStoreMock.error.set('Something went wrong');
      fixture.detectChanges();

      expect(component.showError()).toBe(true);

      vi.advanceTimersByTime(3000);

      expect(component.showError()).toBe(false);
      expect(transferStoreMock.setError).toHaveBeenCalledWith('');
    });

    it('should not show error when error is empty', () => {
      transferStoreMock.error.set('');
      fixture.detectChanges();
      expect(component.showError()).toBe(false);
    });
  });

  describe('Toast Behavior', () => {
    it('should set toast message on init', () => {
      expect(component.currentToastMessage()).toBe('transfers.internal.amount.accountsSelected');
    });

    it('should show and hide success toast with timeout', () => {
      component.currentToastMessage.set('test.message');
      component.showSuccess.set(true);
      expect(component.showSuccess()).toBe(true);

      setTimeout(() => component.showSuccess.set(false), 3000);
      vi.advanceTimersByTime(3000);
      expect(component.showSuccess()).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should reset store and navigate on success done', () => {
      component.onSuccessDone();

      expect(transferStoreMock.reset).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/bank/dashboard']);
    });
  });
});
