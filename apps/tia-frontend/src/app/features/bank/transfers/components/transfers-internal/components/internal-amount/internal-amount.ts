import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  OnInit,
  DestroyRef,
  effect,
  Signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferInternalService } from '../../services/transfer.internal.service';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { of, tap } from 'rxjs';
import { SuccessModal } from '@tia/shared/lib/overlay/ui-success-modal/ui-success-modal';
import { Router } from '@angular/router';
import { OtpModal } from '@tia/shared/lib/overlay/ui-otp-modal/otp-modal';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tooltip } from '@tia/shared/lib/data-display/tooltip/tooltip';
import { TransferSummaryComponent } from '../../../../ui/transfer-summary/transfer-summary';

@Component({
  selector: 'app-internal-amount',
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
    TransferSummaryComponent,
  ],
  templateUrl: './internal-amount.html',
  styleUrl: './internal-amount.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalAmount implements OnInit {
  private readonly transferStore = inject(TransferStore);
  private readonly transferInternalService = inject(TransferInternalService);
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
  public readonly selectedSenderAccount = this.transferStore.senderAccount;
  public readonly selectedRecipientAccount =
    this.transferStore.receiverOwnAccount;
  public readonly hasInsufficientBalance =
    this.transferStore.hasInsufficientBalance;
  public readonly successfulTransfer = this.transferStore.transferSuccess;
  public readonly requiresOtp = this.transferStore.requiresOtp;
  public readonly errorFromState = this.transferStore.error;

  public readonly activeInput = signal<'source' | 'destination'>('source');
  public readonly conversionRate = signal<number>(0);
  public readonly isConversionMode = computed(
    () =>
      this.selectedSenderAccount()?.currency !==
      this.selectedRecipientAccount()?.currency,
  );

  public readonly amountInput = this.fb.control(
    this.transferStore.amount() || '',
    [Validators.required, Validators.min(0.01)],
  );

  public readonly sourceAmountConfig = computed(() => ({
    label: `${this.translate.instant('transfers.internal.amount.send')} (${this.selectedSenderAccount()?.currency || ''})`,
    placeholder: '0.00',
  }));

  public readonly destinationAmountInput = this.fb.control('', [
    Validators.required,
    Validators.min(0.01),
  ]);

  public readonly descriptionInput = this.fb.control(
    this.transferStore.description() || '',
  );

  public readonly currency = computed(
    () => this.selectedSenderAccount()?.currency || '',
  );

  public readonly amountConfig = computed(() => ({
    label: `${this.translate.instant('transfers.internal.amount.label')} (${this.currency()})`,
    placeholder: '0.00',
  }));

  public readonly destinationAmountConfig = computed(() => ({
    label: `${this.translate.instant('transfers.internal.amount.receive')} (${this.selectedRecipientAccount()?.currency || ''})`,
    placeholder: '0.00',
  }));

  public readonly descriptionConfig = computed(() => ({
    label: this.translate.instant(
      'transfers.internal.amount.description.label',
    ),
    placeholder: this.translate.instant(
      'transfers.internal.amount.description.placeholder',
    ),
  }));

  public readonly availableBalance = computed(
    () => this.selectedSenderAccount()?.balance ?? 0,
  );

  public readonly recipientInitials = computed(() => {
    const name = this.selectedRecipientAccount()?.friendlyName || '';
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

  private readonly destinationAmountStatus = toSignal(
    this.destinationAmountInput.statusChanges,
    {
      initialValue: this.destinationAmountInput.status,
    },
  );

  private readonly amountValue = toSignal(this.amountInput.valueChanges, {
    initialValue: this.amountInput.value,
  });

  private readonly destinationAmountValue = toSignal(
    this.destinationAmountInput.valueChanges,
    {
      initialValue: this.destinationAmountInput.value,
    },
  );

  public readonly isTransferDisabled = computed(() => {
    if (this.isConversionMode()) {
      const hasAmount =
        (this.amountValue() && Number(this.amountValue()) >= 0.01) ||
        (this.destinationAmountValue() &&
          Number(this.destinationAmountValue()) >= 0.01);
      return !hasAmount || this.isLoading() || this.hasInsufficientBalance();
    }
    return (
      this.amountStatus() !== 'VALID' ||
      this.isLoading() ||
      this.hasInsufficientBalance()
    );
  });

  constructor() {
    effect(() => {
      const error = this.errorFromState();
      if (error) {
        this.showError.set(true);
        setTimeout(() => {
          this.showError.set(false);
          this.transferStore.setError('');
        }, 3000);
      }
    });

    effect(() => {
      const sender = this.selectedSenderAccount();
      const receiver = this.selectedRecipientAccount();

      if (sender && receiver && sender.currency !== receiver.currency) {
        this.transferInternalService.fetchConversionRate(
          sender.currency,
          receiver.currency,
          (rate) => {
            this.conversionRate.set(rate);
            const sourceAmount = Number(this.amountInput.value);
            if (sourceAmount >= 0.01) {
              this.updateDestinationAmount(sourceAmount);
            }
          },
          () => this.conversionRate.set(0),
        );
      }
    });
  }

  public ngOnInit(): void {
    this.amountInput.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          if (this.isConversionMode()) {
            this.activeInput.set('source');
            this.updateDestinationAmount(Number(value));
          }
          this.transferInternalService.handleAmountInput(Number(value));
        }),
      )
      .subscribe();

    this.destinationAmountInput.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          if (this.isConversionMode()) {
            this.activeInput.set('destination');
            const sourceAmount = this.updateSourceAmount(Number(value));
            if (sourceAmount !== null) {
              this.transferInternalService.handleAmountInput(sourceAmount);
            }
          }
        }),
      )
      .subscribe();

    this.triggerToast('transfers.internal.amount.accountsSelected');
  }

  private updateDestinationAmount(sourceAmount: number): void {
    if (!this.conversionRate()) return;

    const converted = sourceAmount * this.conversionRate();
    this.destinationAmountInput.setValue(converted.toFixed(2), {
      emitEvent: false,
    });
  }

  private updateSourceAmount(destinationAmount: number): number | null {
    if (!this.conversionRate()) return null;

    const converted = destinationAmount / this.conversionRate();
    this.amountInput.setValue(converted.toFixed(2), { emitEvent: false });
    return converted;
  }

  public onGoBack(): void {
    this.transferInternalService.handleAmountGoBack(
      Number(this.amountInput.value),
      this.descriptionInput.value || '',
    );
  }

  public onTransfer(): void {
    if (this.isConversionMode()) {
      this.transferStore.setDescription(this.descriptionInput.value || '');

      const isReverse = this.activeInput() === 'destination';
      const amount = isReverse
        ? Number(this.destinationAmountInput.value)
        : Number(this.amountInput.value);

      this.transferStore.setAmount(amount);
      this.transferInternalService.handleCrossCurrencyTransfer(isReverse);
    } else {
      if (this.amountInput.valid) {
        this.transferStore.setDescription(this.descriptionInput.value || '');
        this.transferInternalService.handleToOwnTransfer();
      }
    }
  }

  private triggerToast(messageKey: string): void {
    this.currentToastMessage.set(messageKey);
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }

  public onSuccessDone(): void {
    this.transferInternalService.clearInternalSelection();
    this.transferStore.reset();
    this.router.navigate(['/bank/dashboard']);
  }
}
