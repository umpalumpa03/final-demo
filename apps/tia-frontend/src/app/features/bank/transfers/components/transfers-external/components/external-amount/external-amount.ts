import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  OnInit,
  DestroyRef,
  effect,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferAmountService } from '../../services/transfer-amount.service';
import { TransferExecutionService } from '../../services/transfer-execution.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { tap } from 'rxjs';
import { SuccessModal } from '@tia/shared/lib/overlay/ui-success-modal/ui-success-modal';
import { Router } from '@angular/router';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { OtpVerification } from 'apps/tia-frontend/src/app/core/auth/shared/otp-verification/otp-verification';
import { IVerified } from 'apps/tia-frontend/src/app/core/auth/models/otp-verification.models';
import { transferOtpConfig } from '../../config/transfers-external.config';

@Component({
  selector: 'app-external-amount',
  imports: [
    ButtonComponent,
    TranslatePipe,
    TextInput,
    ReactiveFormsModule,
    AlertTypesWithIcons,
    DecimalPipe,
    SuccessModal,
    RouteLoader,
    Tooltip,
    UiModal,
    OtpVerification,
  ],
  providers: [],
  templateUrl: './external-amount.html',
  styleUrl: './external-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalAmount implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly amountService = inject(TransferAmountService);
  private readonly executionService = inject(TransferExecutionService);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly breakpointService = inject(BreakpointService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly isMobile = this.breakpointService.isMobile;
  public readonly showSuccess = signal(false);
  public readonly showError = signal(false);
  public readonly currentToastMessage = signal('');

  public readonly isLoading = this.transferStore.isLoading;
  public readonly isFeeLoading = this.transferStore.isFeeLoading;
  public readonly fee = this.transferStore.fee;
  public readonly totalWithFee = this.transferStore.totalWithFee;
  public readonly selectedSenderAccount = this.transferStore.senderAccount;
  public readonly hasInsufficientBalance =
    this.transferStore.hasInsufficientBalance;
  public readonly selectedRecipientAccount =
    this.transferStore.selectedRecipientAccount;
  public readonly manualRecipientName = this.transferStore.manualRecipientName;
  public readonly recipientInfo = this.transferStore.recipientInfo;
  public readonly successfullTransfer = this.transferStore.transferSuccess;
  public readonly requiresOtp = this.transferStore.requiresOtp;
  public readonly errorFromState = this.transferStore.error;
  public readonly otpConfig = transferOtpConfig['extrenal'];
  public readonly noAttemptsLeft = signal(false);

  public readonly isExternalIban = computed(
    () => this.transferStore.recipientType() === 'iban-different-bank',
  );

  public readonly amountInput = this.fb.control(
    this.transferStore.amount() || '',
    [Validators.required, Validators.min(0.01)],
  );

  public readonly descriptionInput = this.fb.control(
    this.transferStore.description() || '',
  );

  public readonly currency = computed(
    () => this.selectedSenderAccount()?.currency || '',
  );

  public readonly amountConfig = computed(() => ({
    label: `${this.translate.instant('transfers.external.amount.label')} (${this.currency()})`,
    placeholder: '0.00',
  }));

  public readonly descriptionConfig = computed(() => ({
    label: this.translate.instant(
      'transfers.external.amount.description.label',
    ),
    placeholder: this.translate.instant(
      'transfers.external.amount.description.placeholder',
    ),
  }));

  public readonly availableBalance = computed(
    () => this.selectedSenderAccount()?.balance ?? 0,
  );

  public readonly recipientInitials = computed(() => {
    const name = this.isExternalIban()
      ? this.manualRecipientName()
      : this.recipientInfo()?.fullName ||
        this.selectedRecipientAccount()?.name ||
        '';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  });
  private readonly amountStatus = toSignal(this.amountInput.statusChanges, {
    initialValue: this.amountInput.status,
  });
  public readonly isTransferDisabled = computed(() => {
    const isInvalid = this.amountStatus() !== 'VALID';
    return (
      isInvalid ||
      this.isLoading() ||
      this.transferStore.hasInsufficientBalance()
    );
  });

  constructor() {
    effect(() => {
      const error = this.errorFromState();
      if (error) {
        this.showError.set(true);
        setTimeout(() => {
          this.showError.set(false);
          // this.transferStore.setError('');
        }, 3000);
      }
    });
  }

  public ngOnInit(): void {
    const initialAmount = this.transferStore.amount();
    if (initialAmount > 0) {
      this.amountService.handleAmountInput(initialAmount);
    }

    if (!this.transferStore.hasShownAmountToast()) {
      this.triggerToast('transfers.external.amount.accountsSelected');
      this.transferStore.setHasShownAmountToast(true);
    }

    this.amountInput.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          this.amountService.handleAmountInput(Number(value));
        }),
      )
      .subscribe();
  }
  public onGoBack(): void {
    this.amountService.handleAmountGoBack(
      Number(this.amountInput.value),
      this.descriptionInput.value || '',
    );
  }
  public onTransfer(): void {
    if (this.amountInput.valid) {
      this.transferStore.setDescription(this.descriptionInput.value || '');

      if (this.isExternalIban()) {
        this.executionService.handleOtherBankTransfer();
      } else {
        this.executionService.handleSameBankTransfer();
      }
    }
  }
  private triggerToast(messageKey: string): void {
    this.currentToastMessage.set(messageKey);
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }
  public onSuccessDone(): void {
    this.transferStore.reset();
    this.router.navigate(['/bank/dashboard']);
  }
  public onOtpClose(): void {
    this.transferStore.setRequiresOtp(false);
    this.noAttemptsLeft.set(false);
  }
  public onOtpVerify(event: IVerified): void {
    const otpCode = event.otp;
    if (otpCode) {
      this.executionService.verifyTransfer(otpCode);
    }
  }
  public onResendOtp(): void {}

  public resendOtp(isCalled: boolean): void {
    // console.log(isCalled);
  }
  public handleNoMoreAttempts(): void {
    this.noAttemptsLeft.set(true);
    setTimeout(() => {
      this.transferStore.reset();
    }, 3000);
  }
}
